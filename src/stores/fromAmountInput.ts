import { createStore } from "@xstate/store";

export const fromAmountInputStore = createStore(
	{
		value: undefined as string | undefined,
	},
	{
		set: (_, { newAmount }: { newAmount: string }) => ({
			value: newAmount,
		}),
	},
);
