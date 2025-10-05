import { CreateBlogDataAPI, getImageFile } from '@/tests/data/create-blog';
import { ImagePostResponse } from '@/types/api';
import { APIRequestContext } from '@playwright/test';

export const storeImage = async (
  apiContext: APIRequestContext,
  blogData: CreateBlogDataAPI
): Promise<ImagePostResponse> => {
  const imageFile = getImageFile(blogData.featureImageFileName);

  const imageResponse = await apiContext.post(
    `/api/blogs/${blogData.id}/image`,
    {
      multipart: {
        blogId: blogData.id,
        slug: blogData.slug,
        featureImage: imageFile,
      },
    }
  );

  return await imageResponse.json();
};
