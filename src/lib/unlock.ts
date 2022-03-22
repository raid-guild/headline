import { ethers } from "ethers";
import { DOMAIN } from "../constants";
import { networks } from "lib/networks";
import { PublicationLock } from "services/publication/slice";

export const checkoutRedirect = (
  name: string | null,
  pubLocks: PublicationLock[] | null
) => {
  const base = "https://app.unlock-protocol.com/checkout?";
  const locks = {} as { [key: string]: { network: number } };
  for (const lock of pubLocks || []) {
    locks[lock.address] = {
      network: networks[lock.chainId].chainNumber,
    };
  }
  const checkoutParams = {
    locks: locks,
    callToAction: {
      default: `Thank you for wanting to subscribe to ${name}`,
    },
    metadataInputs: [
      {
        name: "Email",
        type: "text",
        required: true,
      },
    ],
    pessimistic: true,
  };
  const prms = new URLSearchParams({
    paywallConfig: JSON.stringify(checkoutParams) || "",
    redirctUri: DOMAIN as string,
  });
  return `${base}${prms.toString()}`;
};

export const fetchUserMetadata = async (
  address: string,
  provider: ethers.providers.Web3Provider
) => {
  // const x = {
  //   types: {
  //     EIP712Domain: [
  //       { name: "name", type: "string" },
  //       { name: "version", type: "string" },
  //       { name: "chainId", type: "uint256" },
  //       { name: "verifyingContract", type: "address" },
  //       { name: "salt", type: "bytes32" },
  //     ],
  //     KeyMetadata: [],
  //   },
  //   domain: { name: "Unlock", version: "1" },
  //   primaryType: "KeyMetadata",
  //   message: {
  //     LockMetaData: {
  //       address: "0xdcc16895396d619fff92921957124db83c260913",
  //       owner: "0xEAC5F0d4A9a45E1f9FdD0e7e2882e9f60E301156",
  //       timestamp: 1647915321724,
  //       page: 0,
  //     },
  //   },
  // };

  const domain = {
    name: "Unlock",
    version: "1",
  };
  const types = {
    LockMetaData: [
      { name: "address", type: "address" },
      { name: "owner", type: "address" },
    ],
  };

  const value = {
    address: "0xdcc16895396d619fff92921957124db83c260913",
    owner: "0xEAC5F0d4A9a45E1f9FdD0e7e2882e9f60E301156",
  };

  const signer = provider.getSigner();
  const signature = await signer._signTypedData(domain, types, value);
  const authorization = `Bearer ${btoa(signature)}`;
  console.log(signature);
  console.log(authorization);
  const prms = new URLSearchParams({
    data: JSON.stringify(value) || "",
    chainId: "4",
  });

  const resp = await fetch(
    `https://locksmith.unlock-protocol.com/api/key/${address}/keyHolderMetadata?${prms.toString()}`,
    {
      headers: {
        Authorization: authorization,
      },
    }
  ).catch((e) => {
    console.log("here");
    console.error(e);
  });
  console.log(resp);
};
