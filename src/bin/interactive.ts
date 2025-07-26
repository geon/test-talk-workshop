import { interpret } from "../interpret.js";
import fs from "fs";

function createIo() {
	const inputBuffer: number[] = [];

	process.stdin.on("data", (input) => {
		inputBuffer.push(...input);
	});

	return {
		get: async (): Promise<number> => {
			if (!inputBuffer.length) {
				await new Promise((res) => process.stdin.once("data", res));
				await new Promise((res) => setTimeout(res));
			}

			const value = inputBuffer.shift();
			if (value === undefined) {
				throw new Error("Input ended.");
			}

			return value;
		},
		put: (value: number) => {
			process.stdout.write(String.fromCharCode(value));
		},
	};
}

(async () => {
	const filePath = process.argv[2];
	if (!filePath) {
		throw new Error("No file path");
	}

	await interpret(fs.readFileSync(filePath, "utf8"), createIo());

	// Flushes stdout?
	process.stdout.write("\n");
	process.stdin.destroySoon();
})();
