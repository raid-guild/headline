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

export const storeIpfs = async (content: {
  content: string | ReadableStream;
}) => {
  const ipfs = getIPFSClient();
  const cid = await ipfs.add(content, {
    cidVersion: 1,
    hashAlg: "sha2-256",
  });
  const resp = await ipfs.pin.add(CID.parse(cid.path));
  console.log("Pin request");
  console.log(resp);
  return `ipfs://${cid.path}`;
};
