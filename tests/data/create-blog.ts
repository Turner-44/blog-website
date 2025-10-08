import { resolveFromRoot, TEST_PATHS } from '@/utils/paths';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

export const featureImageFileName = {
  differenceOfOpinion: 'a-difference-of-opinion-feature.png',
  askWhy: 'ask-why-feature.png',
  becomingMatthewWhy: 'becoming-matthew-why-feature.png',
};

export const previewImageFileName = {
  differenceOfOpinion: 'a-difference-of-opinion-preview.png',
  askWhy: 'ask-why-preview.png',
  becomingMatthewWhy: 'becoming-matthew-why-preview.png',
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
    resolveFromRoot(path.join(directory, markdownFileName)),
    'utf-8'
  );
};

export const getImageFile = (
  imageFileName: string,
  category: 'feature' | 'preview',
  directory: string = TEST_PATHS.testsDataImages
) => {
  const imageFolder = path.join(directory, category);

  return fs.createReadStream(
    resolveFromRoot(path.join(imageFolder, imageFileName))
  );
};

export const createBlogDataUI = (
  title = faker.book.title(),
  markdown = markdownFileName.cats,
  featureImage = featureImageFileName.askWhy,
  previewImage = previewImageFileName.askWhy
) => {
  return {
    title,
    slug: faker.helpers
      .slugify(title)
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, ''),
    summary: faker.lorem.sentence(),
    markdown: getMarkdownString(markdown),
    tags: ['test'],
    featureImageFileName: featureImage,
    previewImageFileName: previewImage,
  };
};

export const createBlogDataAPI = (
  title = faker.book.title(),
  markdown = markdownFileName.coffee,
  featureImage = featureImageFileName.differenceOfOpinion,
  previewImage = previewImageFileName.differenceOfOpinion
) => {
  return {
    id: crypto.randomUUID(),
    title,
    slug: title.replaceAll(' ', '-').toLowerCase(),
    summary: faker.lorem.sentence(),
    markdown: getMarkdownString(markdown),
    tags: ['test'],
    featureImageFileName: featureImage,
    previewImageFileName: previewImage,
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
  previewImageFileName: string;
};

export type CreateBlogDataAPI = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  markdown: string;
  tags: string[];
  featureImageFileName: string;
  previewImageFileName: string;
  publishedAt: string;
};
