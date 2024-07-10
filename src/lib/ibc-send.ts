import { broadcast, getAddress, sign } from "@quirks/store";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseIbcSend {
	fromChain: string | null;
	toChain: string | null;
	sourceChannel: string;
	amount: string;
	sourcePort: string;
	denom: string;
}

export const useIbcSend = ({
	fromChain,
	toChain,
	sourceChannel,
	amount,
	sourcePort,
	denom,
}: Partial<UseIbcSend>) => {
	const [isLoading, setIsLoading] = useState(false);

	const ibcSend = useCallback(async () => {
		if (!fromChain || !toChain) {
			toast("Transaction Error", {
				description: "Source or destination chain missing",
				important: true,
				className: "!border-red-500 !text-red-700 !font-bold",
			});
			return;
		}

		if (!sourceChannel || !sourcePort) {
			toast("Transaction Error", {
				description: "Source port or source channel missing",
				important: true,
				className: "!border-red-500 !text-red-700 !font-bold",
			});
			return;
		}

		if (!amount || !denom) {
			toast("Transaction Error", {
				description: "Amount or IBC denom missing",
				important: true,
				className: "!border-red-500 !text-red-700 !font-bold",
			});
			return;
		}

		setIsLoading(true);
		const ibc = (await import("osmojs")).ibc;

		const { transfer } =
			ibc.applications.transfer.v1.MessageComposer.withTypeUrl;
		const msg = transfer({
			sender: getAddress(fromChain),
			receiver: getAddress(toChain),
			memo: "",
			sourceChannel,
			sourcePort,
			timeoutHeight: {
				revisionHeight: BigInt(0),
				revisionNumber: BigInt(0),
			},
			token: {
				amount,
				denom,
			},
			timeoutTimestamp: BigInt(
				(new Date().getTime() + 1000 * 60 * 5) * 1000000,
			),
		});

		const txRaw = await sign(fromChain, [msg]);

		const res = await broadcast(fromChain, txRaw);
		setIsLoading(false);
		return res;
	}, [amount, denom, fromChain, sourceChannel, sourcePort, toChain]);

	return { ibcSend, isLoading };
};
