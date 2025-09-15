import { NextResponse } from 'next/server';
import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { dynamoDBClient } from '@/app/lib/db';

const TABLE_NAME = process.env.POSTS_TABLE || 'BlogPosts';

type CreateBlogItem = {
    PK: 'BLOG';
    SK: string;
    id?: string;
    slug: string;
    title: string;
    summary: string;
    imageKey: string;
    markdownKey?: string;
    publishedAt: string; // from <input type="datetime-local">
    tags: string[]; // array of strings
};

const attributes = {
    id: 'id',
    slug: 'slug',
    title: 'title',
    summary: 'summary',
    imageKey: 'imageKey',
    markdownKey: 'markdownKey',
    publishedAt: 'publishedAt',
    tags: 'tags',
};

const getQueryCommandAttr = (url: URL): QueryCommandInput => ({
    TableName: TABLE_NAME,
    KeyConditionExpression: '#pk = :blog',
    ExpressionAttributeNames: { '#pk': 'PK' },
    ExpressionAttributeValues: { ':blog': 'BLOG' },
    // SK is "publishedAt#id" → newest first
    ScanIndexForward: false,
    Limit: Number(url.searchParams.get('limit')) ?? 50,
    ProjectionExpression: Object.values(attributes).join(', '),
});

const getQueryCommandAttrBySlug = (url: URL): QueryCommandInput => ({
    TableName: TABLE_NAME,
    IndexName: 'slug-index', // whatever name you gave it
    KeyConditionExpression: 'slug = :slug',
    ExpressionAttributeValues: {
        ':slug': `${url.searchParams.get('slug')}`,
    },
});

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);

        console.log(
            'GET /api/blogs called with params:',
            url.searchParams.toString()
        );

        let queryParams;

        if (url.searchParams.get('slug')) {
            queryParams = getQueryCommandAttrBySlug(url);
        } else {
            queryParams = getQueryCommandAttr(url);
        }

        const out = await dynamoDBClient.send(new QueryCommand(queryParams));

        return NextResponse.json({
            items: out.Items ?? [],
            count: out.Count ?? 0,
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: 'Failed to load posts' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const reqData = await req.json();

        // 👇 Stamp publish time as "now" in UTC ISO format
        const publishedAtDateTime = new Date()
            .toISOString()
            .replace(/\.\d{3}Z$/, 'Z');

        const item: CreateBlogItem = {
            PK: 'BLOG',
            SK: `${publishedAtDateTime}#${reqData.id}`,
            id: reqData.id,
            title: reqData.title,
            slug: reqData.slug,
            summary: reqData.summary,
            imageKey: reqData.imageKey,
            markdownKey: reqData.markdownKey,
            publishedAt: reqData.publishedAt,
            tags: reqData.tags,
        };

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: item,
            // uncomment if you want to prevent overwrites:
            // ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
        });

        const resp = await dynamoDBClient.send(command);

        return NextResponse.json(
            {
                ok: true,
                meta: { consumed: resp.ConsumedCapacity },
            },
            { status: 201 }
        );
    } catch (err: any) {
        console.error('POST /api/blogs error:', err);
        return NextResponse.json(
            { ok: false, error: String(err) },
            { status: 500 }
        );
    }
}
