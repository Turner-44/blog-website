export type MarkdownResponses = {
  Post: MarkdownPostResponse;
  Get: MarkdownGetResponse;
  Delete: MarkdownDeleteResponse;
};

interface MarkdownPostResponse {
  blogId: string;
  markdownKey: string;
}

interface MarkdownGetResponse {
  markdown: string;
}

interface MarkdownDeleteResponse {
  message: string;
  markdownKey: string;
}
