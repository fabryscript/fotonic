import type { Asset } from "@nabla-studio/chain-registry";
import { createStore } from "@xstate/store";

export const selectedAssetsStore = createStore(
	{
		from: undefined as Asset | undefined,
	},
	{
		set: (_, { asset }: { asset: Asset }) => ({
			from: asset,
		}),
		remove: (ctx) => ({
			...ctx,
			from: undefined,
		}),
	},
);
