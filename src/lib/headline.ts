import LitJsSdk from "lit-js-sdk";

import { fetchIPFS, storeIpfs } from "lib/ipfs";
import { getKeyAndEncrypt, getKeyAndDecrypt, LitNodeClient } from "lib/lit";
import { Publication } from "services/publication/slice";
import { ChainName } from "types";

export const storeAndEncryptArticle = async (
  chainName: ChainName | undefined,
  publication: Publication,
  articleStatus: "draft" | "published" | undefined,
  content: string,
  litClient: LitNodeClient,
  encrypt = false
) => {
  let encodedContent = content;
  if (encrypt) {
    if (!articleStatus) {
      throw Error("Missing encrypt type");
    }
    if (!chainName) {
      throw Error("Missing chain name");
    }

    const access =
      articleStatus === "draft"
        ? publication.draftAccess
        : publication.publishAccess;
    const encryptedText = await getKeyAndEncrypt(
      chainName,
      access.encryptedSymmetricKey,
      access.accessControlConditions,
      content,
      litClient
    );
    if (!encryptedText) {
      console.error("Missing encrypted");
      return;
    }
    encodedContent = LitJsSdk.uint8arrayToString(
      new Uint8Array(await encryptedText.arrayBuffer()),
      "base64"
    );
  }
  const publicationUrl = await storeIpfs({ content: encodedContent });
  return publicationUrl;
};

export const fetchAndDecryptArticle = async (
  chainName: ChainName | undefined,
  publication: Publication,
  articleStatus: "draft" | "published" | undefined,
  publicationUrl: string,
  litClient: LitNodeClient,
  decrypt = false
) => {
  const articleBlob = await fetchIPFS(publicationUrl);
  const access =
    articleStatus === "draft"
      ? publication.draftAccess
      : publication.publishAccess;

  const txt = await articleBlob.text();

  let content = txt;
  if (decrypt) {
    if (!chainName) {
      throw Error("Missing chain name");
    }

    content = await getKeyAndDecrypt(
      chainName,
      access.encryptedSymmetricKey,
      access.accessControlConditions,
      txt,
      litClient
    );
  }
  return content;
};
