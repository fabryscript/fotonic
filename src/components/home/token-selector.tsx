import { useChains, useConfig } from "@quirks/react";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { useCallback, useState } from "react";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

interface TokenSelectorProps {
	direction: "From" | "To";
}

export default function TokenSelector({ direction }: TokenSelectorProps) {
	const [chain, setChain] = useQueryState(
		direction === "From" ? "fromChain" : "toChain",
	);

	const [asset, setAsset] = useQueryState(
		direction === "From" ? "fromAsset" : "toAsset",
	);

	const onChainChange = useCallback(
		(value: string) => {
			setAsset(null);
			setChain(value);
		},
		[setAsset, setChain],
	);

	const [amount, setAmount] = useState<string>("");
	const { accounts } = useChains();
	const { assetsLists } = useConfig();

	return (
		<div className="flex flex-col items-center justify-between h-[200px] rounded-md w-full py-10">
			<div className="flex items-center w-full justify-between gap-12">
				<Select value={chain ? chain : undefined} onValueChange={onChainChange}>
					<SelectTrigger>
						<SelectValue
							className="capitalize"
							placeholder={`${direction} chain`}
						/>
					</SelectTrigger>
					<SelectContent>
						{accounts.map(({ chainName, chainId }) => (
							<SelectItem
								key={chainId}
								value={chainName}
								className="capitalize"
							>
								{chainName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select
					disabled={!chain}
					value={asset ? asset : undefined}
					onValueChange={setAsset}
				>
					<SelectTrigger>
						<SelectValue placeholder={`${direction} asset`} />
					</SelectTrigger>
					<SelectContent>
						{assetsLists
							.find((list) => list.chain_name === chain)
							?.assets.map(({ name, symbol, logo_URIs }, i) => {
								const logo = logo_URIs?.svg ?? logo_URIs?.png;
								return (
									<SelectItem
										key={`${symbol} ${
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											i
										}`}
										value={symbol}
									>
										<div className="flex items-center gap-2">
											{logo && (
												<Image
													src={logo}
													alt={`${symbol} logo`}
													width={24}
													height={24}
												/>
											)}
											{name}
										</div>
									</SelectItem>
								);
							})}
					</SelectContent>
				</Select>
			</div>
			<div className="flex flex-col w-full">
				{direction === "From" ? (
					<>
						<Input
							type="number"
							value={amount}
							className="h-24 w-full text-5xl bg-transparent px-0"
							placeholder="0"
							onChange={(e) => {
								if (e.target.value.length > 32) {
									return;
								}

								setAmount(e.target.value);
							}}
						/>
						<span className="font-medium text-neutral-500">
							Available: 0.0005 {asset}
						</span>
					</>
				) : (
					<span className="text-5xl">1923</span>
				)}
			</div>
		</div>
	);
}
