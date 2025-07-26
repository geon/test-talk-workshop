export async function interpret(
	code: string,
	io: {
		get: () => Promise<number>;
		put: (value: number) => void;
	},
): Promise<void> {
	const instructions = createInstructions(code);

	switch (instructions.getNext()) {
		case undefined: {
			return;
		}

		case ".": {
			io.put(0);
			break;
		}
	}
}

function createInstructions(code: string) {
	return {
		getNext: (): string | undefined => code[0],
	};
}
