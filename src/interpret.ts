export async function interpret(
	_code: string,
	_io: {
		get: () => Promise<number>;
		put: (value: number) => void;
	},
): Promise<void> {
	throw new Error("Not implemented.");
}
