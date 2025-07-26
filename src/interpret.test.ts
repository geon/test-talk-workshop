import { suite, test, expect } from "vitest";
import { interpret } from "./interpret.js";

testCases([
	{
		name: "empty program",
		code: "",
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
