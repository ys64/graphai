import { AgentFunction } from "graphai";

import assert from "node:assert";

export const popAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>> = async (context) => {
  const { namedInputs } = context;
  assert(namedInputs, "namedInputs is UNDEFINED!");
  const { array } = namedInputs;
  const arrayCopy = array.map((item: any) => item); // shallow copy
  const item = arrayCopy.pop();
  return { array: arrayCopy, item };
};

const popAgentInfo = {
  name: "popAgent",
  agent: popAgent,
  mock: popAgent,
  inputs: {
    properties: {
      array: {
        type: "array",
        description: "the array to pop an item from",
      },
    },
    required: ["array"],
  },
  output: {
    properties: {
      item: {
        type: "any",
        description: "the item popped from the array",
      },
      array: {
        type: "array",
        description: "the remaining array",
      },
    },
  },
  samples: [
    {
      inputs: { array: [1, 2, 3] },
      params: {},
      result: {
        array: [1, 2],
        item: 3,
      },
    },
    {
      inputs: { array: ["a", "b", "c"] },
      params: {},
      result: {
        array: ["a", "b"],
        item: "c",
      },
    },
    {
      inputs: {
        array: [1, 2, 3],
        array2: ["a", "b", "c"],
      },
      params: {},
      result: {
        array: [1, 2],
        item: 3,
      },
    },
  ],
  description: "Pop Agent",
  category: ["array"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default popAgentInfo;
