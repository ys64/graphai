import { AgentFunction, AgentFunctionInfo, assert } from "graphai";
import path from "path";

import type { GraphAIPathName, GraphAIDirNames } from "@graphai/agent_utils";

type InputsParam = Partial<GraphAIDirNames & GraphAIPathName>;
// https://nodejs.org/api/path.html
export const pathUtilsAgent: AgentFunction<
  {
    method: string;
  } & InputsParam,
  GraphAIPathName,
  InputsParam
> = async ({ namedInputs, params }) => {
  const { method } = params;

  assert(!!method, "pathUtilsAgent: params.method is UNDEFINED!");
  const { dirs, path: userPath } = {
    ...params,
    ...namedInputs,
  };

  if (method === "resolve") {
    assert(!!Array.isArray(dirs), "pathUtilsAgent: dir is not Array!");
    return {
      path: path.resolve(...dirs),
    };
  }
  if (method === "join") {
    assert(!!Array.isArray(dirs), "pathUtilsAgent: dir is not Array!");
    return {
      path: path.join(...dirs),
    };
  }
  if (method === "normalize") {
    assert(!!userPath, "pathUtilsAgent: path is UNDEFINED!");
    return {
      path: path.normalize(userPath),
    };
  }

  throw new Error("pathUtilsAgent no file");
};

const pathUtilsAgentInfo: AgentFunctionInfo = {
  name: "pathUtilsAgent",
  agent: pathUtilsAgent,
  mock: pathUtilsAgent,
  inputs: {
    type: "object",
    properties: {
      dirs: {
        type: "array",
        description: "directory names",
      },
    },
    required: ["dirs"],
  },
  output: {
    path: {
      type: "string",
    },
  },
  samples: [
    {
      inputs: { dirs: ["/base/", "tmp/", "test.txt"] },
      params: { method: "resolve" },
      result: { path: "/base/tmp/test.txt" },
    },
    {
      inputs: { dirs: ["base/", "tmp/", "test.txt"] },
      params: { method: "join" },
      result: { path: "base/tmp/test.txt" },
    },
    {
      inputs: { path: "base///tmp//test.txt" },
      params: { method: "normalize" },
      result: { path: "base/tmp/test.txt" },
    },
  ],
  description: "Path utils",
  category: ["fs"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_node_agents/src/node_file_agents/path_utils_agent.ts",
  package: "@graphai/vanilla_node_agents",
  license: "MIT",
};
export default pathUtilsAgentInfo;
