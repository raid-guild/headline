import { create, CID } from "ipfs-http-client";
import { Buffer } from "buffer";
import { ImageSources } from "@datamodels/identity-profile-basic";

export const getIPFSClient = () => {
  const auth =
    "Basic " +
    Buffer.from(
      import.meta.env.VITE_INFURA_PROJECT_ID +
        ":" +
        import.meta.env.VITE_INFURA_PROJECT_SECRET
    ).toString("base64");
  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });
  return ipfs;
};

export const getProfileImg = ({ original }: ImageSources) => {
  const src = original.src.slice(7);

  return `https://dweb.link/ipfs/${src}`;
};

export const storeIpfs = async (
  content:
    | {
        content: string;
      }
    | ArrayBuffer
) => {
  const ipfs = getIPFSClient();
  const cid = await ipfs.add(content, {
    cidVersion: 1,
    hashAlg: "sha2-256",
  });
  const resp = await ipfs.pin.add(CID.parse(cid.path));
  return `ipfs://${cid.path}`;
};

export const fetchIPFS = async (ipfsHash: string) => {
  const resp = await fetch(
    `https://ipfs.infura.io:5001/api/v0/cat?arg=${ipfsHash
      .split("/")
      .slice(2)}`,
    {
      method: "post",
    }
  );
  const blob = await resp?.blob();
  return blob;
};
