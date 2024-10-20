"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatDataSource = exports.flatDataSourceNodeIds = exports.namedInputs2dataSources = exports.inputs2dataSources = void 0;
const utils_1 = require("./utils");
const inputs2dataSources = (inputs, graphVersion) => {
    return inputs.reduce((tmp, input) => {
        tmp[input] = (0, utils_1.parseNodeName)(input, graphVersion);
        return tmp;
    }, {});
};
exports.inputs2dataSources = inputs2dataSources;
const nestedParseNodeName = (input, graphVersion) => {
    if (Array.isArray(input)) {
        return input.map((inp) => nestedParseNodeName(inp, graphVersion));
    }
    if ((0, utils_1.isNamedInputs)(input)) {
        return (0, exports.namedInputs2dataSources)(input, graphVersion);
    }
    if (typeof input === "string") {
        const templateMatch = [...input.matchAll(/\${(:[^}]+)}/g)].map((m) => m[1]);
        if (templateMatch.length > 0) {
            return nestedParseNodeName(templateMatch, graphVersion);
        }
    }
    return (0, utils_1.parseNodeName)(input, graphVersion);
};
const namedInputs2dataSources = (inputs, graphVersion) => {
    return Object.keys(inputs).reduce((tmp, key) => {
        const input = inputs[key];
        tmp[key] = (0, utils_1.isNamedInputs)(input) ? (0, exports.namedInputs2dataSources)(input, graphVersion) : nestedParseNodeName(input, graphVersion);
        return tmp;
    }, {});
};
exports.namedInputs2dataSources = namedInputs2dataSources;
const flatDataSourceNodeIds = (sources) => {
    return (0, exports.flatDataSource)(sources)
        .filter((source) => source.nodeId)
        .map((source) => source.nodeId);
};
exports.flatDataSourceNodeIds = flatDataSourceNodeIds;
const flatDataSource = (sources) => {
    if (Array.isArray(sources)) {
        return sources.map((source) => (0, exports.flatDataSource)(source)).flat(10);
    }
    if ((0, utils_1.isObject)(sources)) {
        if ("__type" in sources) {
            return sources;
        }
        return (0, exports.flatDataSource)(Object.values(sources));
    }
    return sources;
};
exports.flatDataSource = flatDataSource;
