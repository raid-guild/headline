import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";

export const parseMarkdown = async (title: string, content: string) => {
  const f = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeDocument, { title: title })
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(content);
  return String(f);
};
