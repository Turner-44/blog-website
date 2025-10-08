import { CreateBlogDataAPI, getImageFile } from '@/tests/data/create-blog';
import { ImageResponses } from '@/types/api/image';
import { APIRequestContext } from '@playwright/test';

export const storeImage = async (
  apiContext: APIRequestContext,
  blogData: CreateBlogDataAPI,
  category: 'feature' | 'preview'
): Promise<ImageResponses['Post']> => {
  const imageFileName =
    category === 'feature'
      ? blogData.featureImageFileName
      : blogData.previewImageFileName;

  const imageFile = getImageFile(imageFileName, category);

  const imageResponse = await apiContext.post(
    `/api/blogs/${blogData.id}/image`,
    {
      multipart: {
        blogId: blogData.id,
        slug: blogData.slug,
        image: imageFile,
        category,
      },
    }
  );

  return await imageResponse.json();
};
