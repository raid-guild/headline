import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import { ImageSource } from "@datamodels/identity-profile-basic";

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

export const getProfileImg = ({ original }: ImageSource) => {
  const src = original.src.slice(7);

  return `https://dweb.link/ipfs/${src}`;
};
