import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

export const imagePath = {
  feelOld: 'images/feel-old.jpg',
  thingsLearned: 'images/Things-I-Learned.png',
  failInPublic: 'images/fail-in-public.png',
};

export const markdownPath = {
  cats: 'markdown/cats.mdx',
  coffee: 'markdown/coffee.mdx',
  space: 'markdown/space.mdx',
};

export const resolveFromRoot = (filePath: string): string => {
  const absolutePath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found at path: ${absolutePath}`);
  }

  return absolutePath;
};

export const getMarkdownString = (
  markdownFilePath: string,
  directory: string = 'tests/data/'
) => {
  return fs.readFileSync(
    resolveFromRoot(directory + markdownFilePath),
    'utf-8'
  );
};

export const getImageFile = (
  imageFilePath: string,
  directory: string = 'tests/data/'
) => {
  return fs.createReadStream(resolveFromRoot(directory + imageFilePath));
};

export const createBlogDataUI = (
  title = faker.book.title(),
  markdown = markdownPath.cats,
  image = imagePath.feelOld
) => {
  return {
    title,
    slug: title.replaceAll(' ', '-').toLowerCase(),
    summary: faker.lorem.sentence(),
    markdown: getMarkdownString(markdown),
    tags: ['test'],
    featureImagePath: image,
  };
};

export const createBlogDataAPI = (
  title = faker.book.title(),
  markdown = markdownPath.coffee,
  image = imagePath.thingsLearned
) => {
  return {
    id: crypto.randomUUID(),
    title,
    slug: title.replaceAll(' ', '-').toLowerCase(),
    summary: faker.lorem.sentence(),
    markdown: getMarkdownString(markdown),
    tags: ['test'],
    featureImagePath: image,
    publishedAt: new Date().toISOString(),
  };
};

export type CreateBlogDataUI = {
  title: string;
  slug: string;
  summary: string;
  markdown: string;
  tags: string[];
  featureImagePath: string;
};

export type CreateBlogDataAPI = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  markdown: string;
  tags: string[];
  featureImagePath: string;
  publishedAt: string;
};
