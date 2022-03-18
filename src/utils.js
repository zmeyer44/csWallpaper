import { ethers } from "ethers";

export async function fetchEnsName(address) {
  console.log(address);
  if (address.includes(".eth")) return address;
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  try {
    const res = await provider.lookupAddress(address);

    if (res) {
      return res.charAt(0).toUpperCase() + res.slice(1, 14);
    } else {
      return `${address?.slice(0, 4)}...${address?.slice(-4)}`;
    }
  } catch (err) {
    console.log("ERROR", err);
    return address;
  }
}
