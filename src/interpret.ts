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

			case "-": {
				memory.set(memory.get() - 1);
				break;
			}

			case ">": {
				memory.incrementPointer();
				break;
			}

			case "<": {
				memory.decrementPointer();
				break;
			}

			case "[": {
				if (!memory.get()) {
					instructions.branch();
				}
				break;
			}
		}
	}
}

function buildJumpTable(code: string) {
	const jumpTable: Record<number, number> = {};
	const openStack: number[] = [];

	for (const [currentIndex, instruction] of code.split("").entries()) {
		switch (instruction) {
			case "[": {
				openStack.push(currentIndex);
				break;
			}

			case "]": {
				const openIndex = openStack.pop();
				if (openIndex === undefined) {
					throw new Error(`Unmatched ] at index ${currentIndex}`);
				}
				jumpTable[openIndex] = currentIndex;
				break;
			}
		}
	}

	return jumpTable;
}

function createInstructions(code: string) {
	const jumpTable = buildJumpTable(code);
	let currentInstructionPointer = -1;

	return {
		getNext: (): string | undefined => {
			++currentInstructionPointer;
			return code[currentInstructionPointer];
		},
		branch: () => {
			const jumpTarget = jumpTable[currentInstructionPointer];
			if (jumpTarget === undefined) {
				throw new Error(
					`Missing jump target for branch at index ${currentInstructionPointer}`,
				);
			}
			currentInstructionPointer = jumpTarget;
		},
	};
}

function createMemory() {
	const memory: Record<number, number> = {};
	let pointer = 0;
	return {
		get: (): number => memory[pointer] ?? 0,
		set: (value: number): void => {
			memory[pointer] = value & 0xff;
		},
		incrementPointer: (): void => {
			++pointer;
		},
		decrementPointer: (): void => {
			--pointer;
		},
	};
}
