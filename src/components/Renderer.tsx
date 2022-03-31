import React from "react";
import {
  Callout,
  CodeBlock,
  createIFrameHandler,
  createLinkHandler,
  Doc,
  Heading,
  MarkMap,
  RemirrorRenderer,
  TextHandler,
} from "@remirror/react";
import { RemirrorJSON } from "@remirror/core";

type Props = {
  content: RemirrorJSON;
};
const typeMap: MarkMap = {
  blockquote: "blockquote",
  bulletList: "ul",
  callout: Callout,
  codeBlock: CodeBlock,
  doc: Doc,
  hardBreak: "br",
  heading: Heading,
  horizontalRule: "hr",
  iframe: createIFrameHandler(),
  image: "img",
  listItem: "li",
  paragraph: "p",
  orderedList: "ol",
  text: TextHandler,
};

const markMap: MarkMap = {
  italic: "em",
  bold: "strong",
  code: "code",
  link: createLinkHandler({ target: "_blank" }),
  underline: "u",
};

export const Renderer = ({ content }: Props): JSX.Element => {
  return (
    <RemirrorRenderer json={content} typeMap={typeMap} markMap={markMap} />
  );
};

export default Renderer;
