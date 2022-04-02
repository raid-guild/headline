import { ethers } from "ethers";
import LitJsSdk from "lit-js-sdk";

import { fetchIPFS, storeIpfs } from "lib/ipfs";
import { sendMessage, EmailParams } from "lib/mailgun";
import { getKeyAndEncrypt, getKeyAndDecrypt, LitNodeClient } from "lib/lit";
import { fetchUserMetadata, UnlockUserMetadata } from "lib/unlock";
import { Publication } from "services/publication/slice";
import { Lock } from "services/lock/slice";
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

export const sendMessageFromLocks = async (
  emailSettings: Omit<EmailParams, "to">,
  locks: Lock[],
  walletAddress: string,
  provider: ethers.providers.Web3Provider
) => {
  let toAddresses = [];
  for (const lock of locks) {
    // fetch first page of lcok
    let metaResp = [] as UnlockUserMetadata[] | undefined;
    let page = 0;
    do {
      metaResp = await fetchUserMetadata(
        lock.lockAddress,
        walletAddress,
        provider,
        lock.chainNumber,
        page
      );
      if (!metaResp) {
        break;
      }
      for (const meta of metaResp) {
        toAddresses.push(meta.data.userMetadata.protected.Email);
        // if greater than or equal to 1000 send
        // then set toAddresses to 0
        if (toAddresses.length >= 1000) {
          const settings = { ...emailSettings, to: toAddresses };
          await sendMessage(settings);
          toAddresses = [];
        }
      }
      page++;
    } while (metaResp.length > 1000);
    if (toAddresses.length > 0) {
      const settings = { ...emailSettings, to: toAddresses };
      await sendMessage(settings);
      toAddresses = [];
    }
  }
};
