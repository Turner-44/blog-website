import { BlogPost } from '../blog';

export type SlugResponses = {
  Get: SlugGetResponse;
};

interface SlugGetResponse {
  blogPost: BlogPost;
  prevBlogPost?: BlogPost;
  nextBlogPost?: BlogPost;
}
