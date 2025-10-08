import { BlogMetaData } from '../blog';

export type BlogsResponses = {
  Post: BlogsPostResponse;
  Get: BlogsGetResponse;
  Delete: BlogsDeleteResponse;
};

interface BlogsPostResponse {
  item: BlogMetaData;
}

interface BlogsGetResponse {
  items: BlogMetaData[];
}

interface BlogsDeleteResponse {
  message: string;
  PK: string;
  SK: string;
}
