import { create } from "ipfs-http-client";
import { Buffer } from "buffer";

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
