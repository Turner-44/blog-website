import { BlogMetaData } from '../blog';

export type SlugResponses = {
  Get: SlugGetResponse;
};

interface SlugGetResponse {
  item: BlogMetaData;
}
