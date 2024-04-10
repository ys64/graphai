import path from "path";
import { GraphAI, AgentFunction } from "@/graphai";
import { ChatSession, ChatConfig, ManifestData } from "slashgpt";
import { readGraphaiData } from "~/utils/file_utils";

const config = new ChatConfig(path.resolve(__dirname));

const slashGPTAgent: AgentFunction<{ manifest: ManifestData; prompt: string }, { answer: string }> = async (context) => {
  console.log("executing", context.nodeId, context.params);
  const session = new ChatSession(config, context.params.manifest ?? {});
  const prompt = context.inputs.reduce((prompt, input, index) => {
    return prompt.replace("${" + index + "}", input["answer"]);
  }, context.params.prompt);
  session.append_user_question(prompt);

  await session.call_loop(() => {});
  const message = session.history.last_message();
  if (message === undefined) {
    throw new Error("No message in the history");
  }
  const result = { answer: message.content };
  return result;
};

const runAgent = async (file: string) => {
  const file_path = path.resolve(__dirname) + file;
  const graph_data = readGraphaiData(file_path);
  const graph = new GraphAI(graph_data, slashGPTAgent);
  const result = await graph.run();
  console.log(result);
};

const main = async () => {
  await runAgent("/graphs/slash_gpt.yml");
  console.log("COMPLETE 1");
};
main();
