import { create } from "ipfs-http-client";

export const getIPFSClient = () => {
  const auth =
    "Basic " +
    Buffer.from(
      process.env.REACT_APP_INFURA_PROJECT_ID +
        ":" +
        process.env.REACT_APP_INFURA_PROJECT_SECRET
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
