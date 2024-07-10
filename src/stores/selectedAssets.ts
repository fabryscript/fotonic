import type { Asset } from "@nabla-studio/chain-registry";
import { createStore } from "@xstate/store";

export const selectedAssetsStore = createStore(
	{
		from: undefined as Asset | undefined,
		to: undefined as Asset | undefined,
	},
	{
		set: (
			_,
			{ asset, direction }: { direction: "From" | "To"; asset: Asset },
		) => ({
			[direction === "From" ? "from" : "to"]: asset,
		}),
		remove: (ctx, { direction }: { direction: "From" | "To" }) => ({
			...ctx,
			[direction === "From" ? "from" : "to"]: undefined,
		}),
	},
);
