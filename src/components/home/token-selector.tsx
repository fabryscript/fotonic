"use client";

import useDirectionalChains from "@/lib/hooks/use-directional-chains";
import { useDisclosure } from "@/lib/hooks/use-disclosure";
import type { Direction } from "@/lib/types";
import { selectedAssetsStore } from "@/stores/selectedAssets";
import type { Asset } from "@nabla-studio/chain-registry";
import { useChains, useConfig } from "@quirks/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useSelector } from "@xstate/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
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
	direction: Direction;
}

export default function TokenSelector({ direction }: TokenSelectorProps) {
	const { chain, setChain, oppositeChain } = useDirectionalChains(direction);
	const router = useRouter();

	const selectedAsset = useSelector(selectedAssetsStore, (s) => s.context.from);

	const onChainChange = useCallback(
		(value: string) => {
			router.refresh();
			selectedAssetsStore.send({ type: "remove" });
			setChain(value);
		},
		[router, setChain],
	);

	const { isOpen: isAssetSelectionOpen, toggle: toggleAssetSelection } =
		useDisclosure();

	const [amount, setAmount] = useState<string>("");

	const { accounts } = useChains();
	const { assetsLists } = useConfig();

	const chainAssets = useMemo(() => {
		if (!chain) return;
		return assetsLists.find((list) => list.chain_name === chain)?.assets;
	}, [assetsLists, chain]);

	const scrollableRef = useRef(null);

	const rowVirtualizer = useVirtualizer({
		count: chainAssets?.length ?? 0,
		getScrollElement: () => scrollableRef.current,
		estimateSize: () => 40,
		enabled: isAssetSelectionOpen,
		overscan: 5,
	});

	const queryAssetFromAssetList = useCallback(
		(chainId: string, base: string) =>
			assetsLists
				.find((list) => list.chain_name === chainId)
				?.assets.find((asset) => asset.base === base),
		[assetsLists],
	);

	return (
		<div className="flex flex-col items-center justify-between rounded-md w-full py-10">
			<div className="flex items-center w-full justify-between gap-12">
				<Select value={chain ? chain : undefined} onValueChange={onChainChange}>
					<SelectTrigger>
						<SelectValue
							className="capitalize"
							placeholder={`${direction} chain`}
						/>
					</SelectTrigger>
					<SelectContent>
						{accounts
							.filter((ac) =>
								oppositeChain ? ac.chainName !== oppositeChain : true,
							)
							.map(({ chainName, chainId }) => {
								return (
									<SelectItem
										key={chainId}
										value={chainName}
										className="capitalize"
									>
										{chainName}
									</SelectItem>
								);
							})}
					</SelectContent>
				</Select>
				{direction === "From" && (
					<Select
						value={selectedAsset?.base}
						disabled={!chain}
						onValueChange={(base) => {
							selectedAssetsStore.send({
								type: "set",
								// biome-ignore lint/style/noNonNullAssertion: <explanation>
								asset: queryAssetFromAssetList(chain!, base)!,
							});
						}}
						open={isAssetSelectionOpen}
						onOpenChange={toggleAssetSelection}
					>
						<SelectTrigger className="relative">
							{selectedAsset && !isAssetSelectionOpen && (
								<div className="absolute left-0 h-10 pl-3 flex">
									<AssetTicker {...selectedAsset} />
								</div>
							)}
							<SelectValue placeholder={`${direction} asset`} />
						</SelectTrigger>
						<SelectContent className="relative">
							<>
								<div
									ref={scrollableRef}
									className="h-full w-full overflow-scroll no-scrollbar"
								>
									<div
										style={{
											height: `${rowVirtualizer.getTotalSize()}px`,
											position: "relative",
											width: "100%",
										}}
									>
										{chainAssets &&
											rowVirtualizer.getVirtualItems().map((virtualItem) => {
												const asset = chainAssets[virtualItem.index];

												return (
													<SelectItem
														key={`${asset.symbol} ${virtualItem.index}`}
														value={asset.base}
														style={{
															position: "absolute",
															top: 0,
															left: 0,
															width: "100%",
															height: `${virtualItem.size}px`,
															transform: `translateY(${virtualItem.start}px)`,
														}}
													>
														<AssetTicker {...asset} />
													</SelectItem>
												);
											})}
									</div>
								</div>
							</>
						</SelectContent>
					</Select>
				)}
			</div>
			<div className="flex flex-col w-full">
				{direction === "From" && (
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
						{selectedAsset && chain && <AmountAvailable chain={chain} />}
					</>
				)}
			</div>
		</div>
	);
}

function AssetTicker(props: Asset) {
	const { name, symbol, logo_URIs } = props;

	const logo = logo_URIs?.svg ?? logo_URIs?.png;

	return (
		<div className="flex items-center gap-2">
			{logo && (
				<Image src={logo} alt={`${symbol} logo`} width={24} height={24} />
			)}
			{name}
		</div>
	);
}
