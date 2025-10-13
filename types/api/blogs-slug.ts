import { BlogMetaData } from '../blog';

export type SlugResponses = {
  Get: SlugGetResponse;
};

interface SlugGetResponse {
  blogPost: BlogMetaData;
  prevBlogPost: BlogMetaData;
  nextBlogPost: BlogMetaData;
}
