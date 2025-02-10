import { z } from "zod";

export const getEthPriceUsd = async (): Promise<string> => {
  const fetchedPrice = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).catch((error) => {
    throw new Error("Error fetching data from the tx service:" + error);
  });

  const ethPriceData = await fetchedPrice.json();
  const ethPriceUsd = ethPriceData?.ethereum?.usd;

  return `The price of 1ETH is ${ethPriceUsd.toLocaleString("en-US")}USD at today's prices.`;
};

export const getEthPriceUsdMetadata = {
  name: "getEthPriceUsd",
  description:
    "Call to get the price of ETH in USD.",
  schema: z.object({}),
};
