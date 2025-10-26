import { BlogPost } from '../blog';

export type SlugResponses = {
  Get: SlugGetResponse;
};

interface SlugGetResponse {
  slugAvailable: boolean;
  blogPost: BlogPost;
  prevBlogPost?: BlogPost;
  nextBlogPost?: BlogPost;
}
