"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanResult = exports.cleanResultInner = exports.resultOf = exports.resultsOf = void 0;
const utils_1 = require("./utils/utils");
const nestedParseNodeName = (input, nodes, graphVersion) => {
    if (Array.isArray(input)) {
        return input.map((inp) => nestedParseNodeName(inp, nodes, graphVersion));
    }
    if ((0, utils_1.isNamedInputs)(input)) {
        return (0, exports.resultsOf)(input, nodes, graphVersion);
    }
    if (typeof input === "string") {
        const templateMatch = [...input.matchAll(/\${(:[^}]+)}/g)].map((m) => m[1]);
        if (templateMatch.length > 0) {
            const results = nestedParseNodeName(templateMatch, nodes, graphVersion);
            return Array.from(templateMatch.keys()).reduce((tmp, key) => {
                return tmp.replaceAll("${" + templateMatch[key] + "}", results[key]);
            }, input);
        }
    }
    return (0, exports.resultOf)((0, utils_1.parseNodeName)(input, graphVersion), nodes);
};
const resultsOf = (inputs, nodes, graphVersion) => {
    if (Array.isArray(inputs)) {
        return inputs.reduce((tmp, key) => {
            tmp[key] = nestedParseNodeName(key, nodes, graphVersion);
            return tmp;
        }, {});
    }
    return Object.keys(inputs).reduce((tmp, key) => {
        const input = inputs[key];
        tmp[key] = (0, utils_1.isNamedInputs)(input) ? (0, exports.resultsOf)(input, nodes, graphVersion) : nestedParseNodeName(input, nodes, graphVersion);
        return tmp;
    }, {});
};
exports.resultsOf = resultsOf;
const resultOf = (source, nodes) => {
    const { result } = source.nodeId ? nodes[source.nodeId] : { result: undefined };
    return (0, utils_1.getDataFromSource)(result, source);
};
exports.resultOf = resultOf;
// for anyInput
const cleanResultInner = (results) => {
    if (Array.isArray(results)) {
        return results.map((result) => (0, exports.cleanResultInner)(result)).filter((result) => !(0, utils_1.isNull)(result));
    }
    if ((0, utils_1.isObject)(results)) {
        return Object.keys(results).reduce((tmp, key) => {
            const value = (0, exports.cleanResultInner)(results[key]);
            if (!(0, utils_1.isNull)(value)) {
                tmp[key] = value;
            }
            return tmp;
        }, {});
    }
    return results;
};
exports.cleanResultInner = cleanResultInner;
const cleanResult = (results) => {
    return Object.keys(results).reduce((tmp, key) => {
        const value = (0, exports.cleanResultInner)(results[key]);
        if (!(0, utils_1.isNull)(value)) {
            tmp[key] = value;
        }
        return tmp;
    }, {});
};
exports.cleanResult = cleanResult;
