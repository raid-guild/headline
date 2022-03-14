import { DOMAIN } from "constants";
import { networks } from "lib/networks";
import { PublicationLock } from "services/lock/slice";

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
    paywallConfig: JSON.stringify(checkoutParams),
    redirctUri: DOMAIN,
  });
  return `${base}${prms.toString()}`;
};
