import * as sanitize from 'sanitize-html';

export const sanitizeHtml = (content: string) => {
  return sanitize(content, {
    allowedAttributes: {},
    allowedTags: [],
  });
};

export default sanitizeHtml;
