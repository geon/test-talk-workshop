export async function interpret(
	code: string,
	io: {
		get: () => Promise<number>;
		put: (value: number) => void;
	},
): Promise<void> {
	const instructions = createInstructions(code);

	while (true) {
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
}

function createInstructions(code: string) {
	let currentInstructionPointer = -1;

	return {
		getNext: (): string | undefined => {
			++currentInstructionPointer;
			return code[currentInstructionPointer];
		},
	};
}
