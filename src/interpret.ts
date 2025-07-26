export async function interpret(
	code: string,
	io: {
		get: () => Promise<number>;
		put: (value: number) => void;
	},
): Promise<void> {
	const instructions = createInstructions(code);
	const memory = createMemory();

	while (true) {
		switch (instructions.getNext()) {
			case undefined: {
				return;
			}

			case ".": {
				io.put(memory.get());
				break;
			}

			case ",": {
				memory.set(await io.get());
				break;
			}

			case "+": {
				memory.set(memory.get() + 1);
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

function createMemory() {
	let memory = 0;
	return {
		get: (): number => memory,
		set: (value: number): void => {
			memory = value;
		},
	};
}
