"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonParserAgent = void 0;
const jsonParserAgent = async ({ namedInputs }) => {
    const { text, data } = namedInputs;
    if (data) {
        return {
            text: JSON.stringify(data, null, 2),
        };
    }
    const match = ("\n" + text).match(/\n```[a-zA-z]*([\s\S]*?)\n```/);
    if (match) {
        return {
            data: JSON.parse(match[1]),
        };
    }
    return {
        data: JSON.parse(text ?? ""),
    };
};
exports.jsonParserAgent = jsonParserAgent;
const sample_object = { apple: "red", lemon: "yellow" };
const json_str = JSON.stringify(sample_object);
const md_json1 = ["```", json_str, "```"].join("\n");
const md_json2 = ["```json", json_str, "```"].join("\n");
const md_json3 = ["```JSON", json_str, "```"].join("\n");
const jsonParserAgentInfo = {
    name: "jsonParserAgent",
    agent: exports.jsonParserAgent,
    mock: exports.jsonParserAgent,
    inputs: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
    },
    output: {
        type: "object",
        properties: {
            text: {
                type: "string",
                description: "json string",
            },
            data: {
                anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
            },
        },
    },
    samples: [
        {
            inputs: { data: sample_object },
            params: {},
            result: { text: JSON.stringify(sample_object, null, 2) },
        },
        {
            inputs: { text: JSON.stringify(sample_object, null, 2) },
            params: {},
            result: { data: sample_object },
        },
        {
            inputs: { text: md_json1 },
            params: {},
            result: { data: sample_object },
        },
        {
            inputs: { text: md_json2 },
            params: {},
            result: { data: sample_object },
        },
        {
            inputs: { text: md_json3 },
            params: {},
            result: { data: sample_object },
        },
    ],
    description: "Template agent",
    category: ["string"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/string_agents/json_parser_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};
exports.default = jsonParserAgentInfo;
