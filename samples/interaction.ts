import { GraphAI, GraphData } from "@/graphai";
import * as readline from "readline";
import { testAgent } from "~/agents/agents";
import { graphDataTestRunner } from "~/utils/runner";

const getUserInput = async (question: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const graph_data: GraphData = {
  nodes: {
    node1: {
      source: true,
    },
    node2: {
      inputs: ["node1"],
    },
  },
};

const main = async () => {
  const query = await getUserInput("Please enter your question: ");
  console.log("query=", query);
  graph_data.nodes.node1.result = { query };

  const result = await graphDataTestRunner("interaction.yaml",  graph_data, testAgent);
  console.log(result);

  console.log("COMPLETE 1");
};

main();
