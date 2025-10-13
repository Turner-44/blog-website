import test, { expect } from '@playwright/test';
import testData from './data/.temp/test-blog-data.json';
import { BlogsResponses } from '@/types/api/blogs';
import { MarkdownResponses } from '@/types/api/markdown';
import { ImageResponses } from '@/types/api/image';

test.use({ storageState: 'tests/.auth/cookies.json' });

test.describe('Check carousel and blog display', { tag: '@e2e' }, () => {
  test('Validate blogs display as expected', async ({ page }) => {
    const blogPosts = testData as {
      blogPost: BlogsResponses['Post'];
      featureImageJson: ImageResponses['Post'];
      previewImageJson: ImageResponses['Post'];
      markdownJson: MarkdownResponses['Post'];
    }[];

    await expect(async () => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      for (let i = 0; i < blogPosts.length; i++) {
        const blog = blogPosts[i];
        await expect(
          page.getByTestId(`header-blog-card-title-${blog.blogPost.slug}`)
        ).toContainText(blog.blogPost.title);
        await expect(
          page.getByTestId(`text-blog-card-summary-${blog.blogPost.slug}`)
        ).toContainText(blog.blogPost.summary);
      }
    }).toPass();

    for (let i = 0; i < blogPosts.length; i++) {
      const blog = blogPosts[i];
      await page.goto(`/blog/${blog.blogPost.slug}`, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.getByTestId('header-blog-title')).toHaveText(
        blog.blogPost.title
      );
    }
  });

  test('Check blog navigation is present', async ({ page }) => {
    const blogPosts = testData as {
      blogPost: BlogsResponses['Post'];
      featureImageJson: ImageResponses['Post'];
      previewImageJson: ImageResponses['Post'];
      markdownJson: MarkdownResponses['Post'];
    }[];

    const firstBlog = blogPosts[0];
    const secondBlog = blogPosts[1];
    const thirdBlog = blogPosts[2];

    await expect(async () => {
      await page.goto(`/blog/${secondBlog.blogPost.slug}`, {
        waitUntil: 'domcontentloaded',
      });

      await expect(page.getByTestId('header-blog-title')).toContainText(
        secondBlog.blogPost.title
      );

      await expect(page.getByTestId('link-next-blog')).toContainText(
        thirdBlog.blogPost.title
      );
    }).toPass();

    await page.getByTestId('link-next-blog').click();
    await expect(page).toHaveURL(
      `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${thirdBlog.blogPost.slug}`
    );
    await expect(page.getByTestId('header-blog-title')).toContainText(
      thirdBlog.blogPost.title
    );

    await page.goBack({ waitUntil: 'domcontentloaded' });

    await expect(page.getByTestId('link-prev-blog')).toContainText(
      firstBlog.blogPost.title
    );

    await page.getByTestId('link-prev-blog').click();
    await expect(page).toHaveURL(
      `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${firstBlog.blogPost.slug}`
    );
    await expect(page.getByTestId('header-blog-title')).toContainText(
      firstBlog.blogPost.title
    );
  });
});
