import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb'

const dbClient = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.DYNAMO_DB_AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.DYNAMO_DB_AWS_SECRET_ACCESS_KEY as string,
    },
})

export const dynamoDBClient = DynamoDBDocumentClient.from(dbClient)
