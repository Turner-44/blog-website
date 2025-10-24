import { BlogCreationError } from '@/errors/api-errors';
import { SuccessResponse } from '@/lib/api/common/response-structures';
import { CreateBlogPostDataAPI, getImageFile } from '@/tests/data/create-blog';
import { ImageResponses } from '@/types/api/image';
import { APIRequestContext } from '@playwright/test';

export const storeImage = async (
  apiContext: APIRequestContext,
  blogPost: CreateBlogPostDataAPI,
  category: 'feature' | 'preview'
): Promise<SuccessResponse<ImageResponses['Post']>> => {
  const imageFileName =
    category === 'feature'
      ? blogPost.featureImageFileName
      : blogPost.previewImageFileName;

  const imageFile = getImageFile(imageFileName, category);

  const imageResponse = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${blogPost.id}/image`,
    {
      multipart: {
        blogId: blogPost.id,
        slug: blogPost.slug,
        image: imageFile,
        category,
      },
    }
  );

  const imageJson = await imageResponse.json();

  if (!imageJson.success) {
    throw new BlogCreationError(imageJson.error.message);
  }

  return imageJson;
};
