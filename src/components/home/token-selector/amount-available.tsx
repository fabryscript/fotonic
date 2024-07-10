import { formatCoin } from "@/lib/formatters";
import { selectedAssetsStore } from "@/stores/selectedAssets";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@xstate/react";
import { useMemo } from "react";

interface AmountAvailableProps {
	chain: string;
}
export default function AmountAvailable({ chain }: AmountAvailableProps) {
	const selectedAsset = useSelector(selectedAssetsStore, (s) => s.context.from);

	const decimals = useMemo(
		() =>
			selectedAsset?.denom_units.find(
				({ denom }) => denom === selectedAsset.symbol.toLowerCase(),
			)?.exponent,
		[selectedAsset?.denom_units, selectedAsset?.symbol],
	);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["balance", selectedAsset?.base],
		queryFn: async () => {
			const res = await fetch(
				`/balances/?chain=${chain}&denom=${selectedAsset?.base}&decimals=${decimals}`,
			);

			return await res.json();
		},
	});

	if (isLoading) {
		return <div className="w-32 h-6 rounded-md bg-neutral-400 animate-pulse" />;
	}

	if (isError || !data) {
		return (
			<span className="font-medium text-neutral-500">
				Error while fetching the balance: {error?.message}
			</span>
		);
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
