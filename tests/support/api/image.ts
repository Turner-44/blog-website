import { CreateBlogDataAPI, getImageFile } from '@/tests/data/create-blog';
import { APIRequestContext } from '@playwright/test';

export const storeImage = async (
  apiContext: APIRequestContext,
  blogData: CreateBlogDataAPI
) => {
  const imageFile = getImageFile(blogData.featureImagePath);

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
