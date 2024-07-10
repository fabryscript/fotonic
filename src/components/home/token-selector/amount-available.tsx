import { formatCoin } from "@/lib/formatters";
import { selectedAssetsStore } from "@/stores/selectedAssets";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@xstate/react";
import { useMemo } from "react";

import { memoKeys } from "@nabla-studio/chain-registry";

interface AmountAvailableProps {
	direction: "From" | "To";
	chain: string;
}
export default function AmountAvailable({
	direction,
	chain,
}: AmountAvailableProps) {
	const selectedAsset = useSelector(
		selectedAssetsStore,
		(s) => s.context[direction === "From" ? "from" : "to"],
	);

	const decimals = useMemo(
		() =>
			selectedAsset?.denom_units.find(
				({ denom }) => denom === selectedAsset.symbol.toLowerCase(),
			)?.exponent,
		[selectedAsset?.denom_units, selectedAsset?.symbol],
	);

	const { data, isLoading } = useQuery({
		queryKey: ["balance", selectedAsset?.base],
		queryFn: async () => {
			const res = await fetch(
				`/balances/?chain=${chain}&denom=${selectedAsset?.base}&decimals=${decimals}`,
			);

			return await res.json();
		},
	});

	memoKeys.memo_keys;

	if (isLoading) {
		return <div className="w-16 h-4 rounded-md bg-neutral-400 animate-pulse" />;
	}

	return (
		<span className="font-medium text-neutral-500">
			Available:{" "}
			{formatCoin(
				{ denom: selectedAsset?.symbol, amount: data.amount },
				{ minimumFractionDigits: decimals },
			)}
		</span>
	);
}
