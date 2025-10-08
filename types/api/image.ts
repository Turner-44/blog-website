export type ImageResponses = {
  Post: ImagePostResponse;
  Delete: ImageDeleteResponse;
};

interface ImagePostResponse {
  blogId: string;
  slug: string;
  imageKey: string;
}

interface ImageDeleteResponse {
  message: string;
  imageKey: string;
}
