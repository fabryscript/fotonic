import { selectedAssetsStore } from "@/stores/selectedAssets";
import { useSelector } from "@xstate/react";

interface AmountAvailableProps {
	direction: "From" | "To";
}

export default function AmountAvailable({ direction }: AmountAvailableProps) {
	const selectedAsset = useSelector(
		selectedAssetsStore,
		(s) => s.context[direction === "From" ? "from" : "to"],
	);

	// const { data, isLoading } = useQuery({
	// 	queryKey: ["amount-available", selectedAsset?.base],
	// 	queryFn: async () => {},
	// });

	return (
		<span className="font-medium text-neutral-500">
			Available: 0.0005 {selectedAsset?.symbol}
		</span>
	);
}
