"use client";

import { selectedAssetsStore } from "@/stores/selectedAssets";
import { useChains, useConfig } from "@quirks/react";
import { useSelector } from "@xstate/react";
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
import AmountAvailable from "./token-selector/amount-available";

interface TokenSelectorProps {
	direction: "From" | "To";
}

export default function TokenSelector({ direction }: TokenSelectorProps) {
	const [chain, setChain] = useQueryState(
		direction === "From" ? "fromChain" : "toChain",
	);

	const selectedAssetBase = useSelector(
		selectedAssetsStore,
		(s) => s.context[direction === "From" ? "from" : "to"]?.base,
	);

	const onChainChange = useCallback(
		(value: string) => {
			selectedAssetsStore.send({ type: "remove", direction });
			setChain(value);
		},
		[direction, setChain],
	);

	const [amount, setAmount] = useState<string>("");
	const { accounts } = useChains();
	const { assetsLists } = useConfig();

	const queryAssetFromAssetList = useCallback(
		(chainId: string, base: string) =>
			assetsLists
				.find((list) => list.chain_name === chainId)
				?.assets.find((asset) => asset.base === base),
		[assetsLists],
	);

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
					value={selectedAssetBase}
					onValueChange={(base) => {
						selectedAssetsStore.send({
							type: "set",
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							asset: queryAssetFromAssetList(chain!, base)!,
							direction,
						});
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder={`${direction} asset`} />
					</SelectTrigger>
					<SelectContent>
						{assetsLists
							.find((list) => list.chain_name === chain)
							?.assets.map((asset, i) => {
								const { name, symbol, logo_URIs, base } = asset;
								const logo = logo_URIs?.svg ?? logo_URIs?.png;
								return (
									<SelectItem
										key={`${symbol} ${
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											i
										}`}
										value={base}
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
						{selectedAssetBase && <AmountAvailable direction={direction} />}
					</>
				) : (
					<span className="text-5xl">1923</span>
				)}
			</div>
		</div>
	);
}
