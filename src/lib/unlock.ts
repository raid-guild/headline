import { ethers } from "ethers";
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
    redirectUri: window.location.toString(),
  });
  return `${base}${prms.toString()}`;
};

export type UnlockUserMetadata = {
  userAddress: string;
  data: {
    userMetadata: {
      protected: {
        Email: string;
      };
    };
  };
};

export const fetchUserMetadata = async (
  lockAddress: string,
  walletAddress: string,
  provider: ethers.providers.Web3Provider,
  chainId: string,
  page = 0
) => {
  const data = {
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
        { name: "salt", type: "bytes32" },
      ],
      KeyMetadata: [],
    },
    domain: { name: "Unlock", version: "1" },
    primaryType: "KeyMetadata",
    message: {
      LockMetaData: {
        address: lockAddress,
        owner: walletAddress,
        timestamp: 1647915321730,
        page: page,
      },
    },
  };

  const signer = provider.getSigner();
  const signature = await signer.signMessage(
    `I want to access member data for ${lockAddress}`
  );
  const authorization = `Bearer-Simple ${btoa(signature)}`;
  console.log(signature);
  console.log(authorization);
  const prms = new URLSearchParams({
    chain: chainId,
    data: JSON.stringify(data) || "",
    signature: signature,
  });

  try {
    const resp = await fetch(
      `https://locksmith.unlock-protocol.com/api/key/${lockAddress}/keyHolderMetadata?${prms.toString()}`,
      {
        headers: {
          Authorization: authorization,
        },
      }
    );
    console.log(resp);

    return (await resp.json()) as UnlockUserMetadata[];
  } catch (e) {
    console.error(e);
  }
};
