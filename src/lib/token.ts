import { ethers, BigNumber } from "ethers";

const SAI_ADDRESS = "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359".toLowerCase();

const erc20abi = [
  "function totalSupply() public view returns (uint)",
  "function balanceOf(address tokenOwner) public view returns (uint balance)",
  "function decimals() public view returns (uint decimals)",
  "function allowance(address tokenOwner, address spender) public view returns (uint remaining)",
  "function transfer(address to, uint tokens) public returns (bool success)",
  "function approve(address spender, uint tokens) public returns (bool success)",
  "function transferFrom(address from, address to, uint tokens) public returns (bool success)",
  "function symbol() public view returns (string)",

  "event Transfer(address indexed from, address indexed to, uint tokens)",
  "event Approval(address indexed tokenOwner, address indexed spender, uint tokens)",
];

export async function getErc20Decimals(
  erc20ContractAddress: string,
  provider: ethers.providers.Provider
) {
  const contract = new ethers.Contract(
    erc20ContractAddress,
    erc20abi,
    provider
  );
  let decimals;
  try {
    decimals = await contract.decimals();
  } catch (e) {
    /** Some ERC20 contracts do not have the right decimals method. Defaults to 18 */
    return 18;
  }
  return ethers.BigNumber.from(decimals);
}

/**
 * yields the symbole for the ERC20 contract
 * @param {*} erc20ContractAddress
 * @param {*} provider
 */
export async function getErc20TokenSymbol(
  erc20ContractAddress: string,
  provider: ethers.providers.Provider
) {
  // The SAI contract has its symbol not implemented
  if (erc20ContractAddress.toLowerCase() === SAI_ADDRESS) {
    return "SAI";
  }
  const contract = new ethers.Contract(
    erc20ContractAddress,
    erc20abi,
    provider
  );
  let symbol;
  try {
    symbol = await contract.symbol();
  } catch (e) {
    /** Some ERC20 contracts, including DAI do not have the right symbol method. */
    return null;
  }
  return symbol;
}

const getBaseChainSymbolAndNumber = (chainId: string, num: string) => {
  switch (chainId) {
    default:
      const readableNum = ethers.utils.parseUnits(num, 18);
      return { symbol: "Eth", num: readableNum.toNumber() };
  }
};

// Something like this should be in the Unlock SDK
//
export const getTokenSymbolAndNumber = async (
  num: string,
  contractAddress: string | null,
  provider: ethers.providers.Provider,
  chainId: string
) => {
  if (!contractAddress) {
    return getBaseChainSymbolAndNumber(chainId, num);
  }
  // TODO: Store chain Id in Ceramic
  // Unlock extraReducers0
  const symbol = await getErc20TokenSymbol(contractAddress, provider);
  const decimals = await getErc20Decimals(contractAddress, provider);
  return { symbol, num: BigNumber.from(num).div(decimals).toNumber() };
};
