import { ChatOllama } from "@langchain/ollama";
// import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";

import {
  deployNewSafe,
  deployNewSafeMetadata,
  getEthBalance,
  getEthBalanceMetadata,
} from "./tools/safe";
import { getEthPriceUsd, getEthPriceUsdMetadata } from "./tools/prices";
import { multiply, multiplyMetadata } from "./tools/math";

const main = async () => {
  // Define the tools for the agent to use
  const agentTools = [
    tool(getEthBalance, getEthBalanceMetadata),
    tool(getEthPriceUsd, getEthPriceUsdMetadata),
    tool(multiply, multiplyMetadata),
    tool(deployNewSafe, deployNewSafeMetadata),
  ];

  // Initialize the agent with a model running locally:
  const agentModel = new ChatOllama({ model: "mistral-nemo" }); // Feel free to try different models. For the full list: https://ollama.com/search?c=tools

  // Or if your prefer using OpenAI (you will need to provide an OPENAI_API_KEY in the .env file.):
  // const agentModel = new ChatOpenAI({ temperature: 0, model: "o3-mini" });

  const agentCheckpointer = new MemorySaver(); // Initialize memory to persist state between graph runs

  const agent = createReactAgent({
    llm: agentModel,
    tools: agentTools,
    checkpointSaver: agentCheckpointer,
  });

  // Let's chat!
  const agentFinalState = await agent.invoke(
    {
      messages: [
        new HumanMessage(
          "what is the current balance of the Safe Multisig at the address 0x220866B1A2219f40e72f5c628B65D54268cA3A9D on chain id 1? Please answer in ETH and its total value in USD."
        ),
      ],
    },
    { configurable: { thread_id: "42" } }
  );

  console.log(
    agentFinalState.messages[agentFinalState.messages.length - 1].content
  );

  // You can continue the conversation by adding more messages:
  // const agentNextState = await agent.invoke(
  //   {
  //     messages: [
  //       new HumanMessage("Could you deploy a new Safe multisig on Sepolia?"),
  //     ],
  //   },
  //   { configurable: { thread_id: "42" } }
  // );

  // console.log("--- Prompt #2 ---");
  // console.log(
  //   agentNextState.messages[agentNextState.messages.length - 1].content
  // );
};

main();
