import { suite, test, expect } from "vitest";
import { interpret } from "./interpret.js";

testCases([
	{
		name: "empty program",
		code: "",
		input: "",
		output: "",
	},
	{
		name: "output",
		code: ".",
		input: "",
		output: "\x00",
	},
	{
		name: "output twice",
		code: "..",
		input: "",
		output: "\x00\x00",
	},
	{
		name: "input",
		code: ",.",
		input: "A",
		output: "A",
	},
	{
		name: "increment memory",
		code: ",.+.+.",
		input: "A",
		output: "ABC",
	},
	{
		name: "decrement memory",
		code: ",.-.-.",
		input: "C",
		output: "CBA",
	},
	{
		name: "overflow memory",
		code: ",+.",
		input: "\xff",
		output: "\x00",
	},
	{
		name: "underflow memory",
		code: "-.",
		input: "",
		output: "\xff",
	},
	{
		name: "increment pointer",
		code: ",>.",
		input: "A",
		output: "\x00",
	},
	{
		name: "decrement pointer",
		code: ">,<.",
		input: "A",
		output: "\x00",
	},
	{
		name: "branch past",
		code: "[.]",
		input: "",
		output: "",
	},
]);

type TestCase = {
	name: string;
	code: string;
	input: string;
	output: string;
};

function createIo(input: string) {
	let inputIndex = 0;
	let output = "";
	return {
		get: async () => {
			const char = input[inputIndex++];
			return char?.charCodeAt(0) ?? 0;
		},
		put: (value: number) => {
			output += String.fromCharCode(value);
		},
		getOutput: () => output,
	};
}

function testCases(cases: TestCase[]) {
	suite("interpret", () => {
		for (const { name, code, input, output } of cases) {
			test(`${name} ("${code}")`, async () => {
				const io = createIo(input);

				await interpret(code, io);

				expect(io.getOutput()).toBe(output);
			});
		}
	});
}
