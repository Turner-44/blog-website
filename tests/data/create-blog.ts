import { resolveFromRoot, TEST_PATHS } from '@/utils/paths';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

export const imageFileName = {
  feelOld: 'feel-old.jpg',
  thingsLearned: 'Things-I-Learned.png',
  failInPublic: 'fail-in-public.png',
};

export const markdownFileName = {
  cats: 'cats.mdx',
  coffee: 'coffee.mdx',
  space: 'space.mdx',
};

export const getMarkdownString = (
  markdownFileName: string,
  directory: string = TEST_PATHS.testsDataMarkdown
) => {
  return fs.readFileSync(
    resolveFromRoot(directory + '/' + markdownFileName),
    'utf-8'
  );
};

export const getImageFile = (
  imageFileName: string,
  directory: string = TEST_PATHS.testsDataImages
) => {
  return fs.createReadStream(resolveFromRoot(directory + '/' + imageFileName));
};

export const createBlogDataUI = (
  title = faker.book.title(),
  markdown = markdownFileName.cats,
  image = imageFileName.feelOld
) => {
  return {
    title,
    slug: title.replaceAll(' ', '-').toLowerCase(),
    summary: faker.lorem.sentence(),
    markdown: getMarkdownString(markdown),
    tags: ['test'],
    featureImageFileName: image,
  };
};

export const createBlogDataAPI = (
  title = faker.book.title(),
  markdown = markdownFileName.coffee,
  image = imageFileName.thingsLearned
) => {
  return {
    id: crypto.randomUUID(),
    title,
    slug: title.replaceAll(' ', '-').toLowerCase(),
    summary: faker.lorem.sentence(),
    markdown: getMarkdownString(markdown),
    tags: ['test'],
    featureImageFileName: image,
    publishedAt: new Date().toISOString(),
  };
};

export type CreateBlogDataUI = {
  title: string;
  slug: string;
  summary: string;
  markdown: string;
  tags: string[];
  featureImageFileName: string;
};

export type CreateBlogDataAPI = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  markdown: string;
  tags: string[];
  featureImageFileName: string;
  publishedAt: string;
};
