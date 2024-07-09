"use client";

import WalletsDrawerContent from "@/components/drawers/wallets";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useChain, useChains, useConfig, useConnect } from "@quirks/react";
import { broadcast, getAddress, sign } from "@quirks/store";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { parseAsString, useQueryState, useQueryStates } from "nuqs";
import { useCallback, useState } from "react";

export const ibcSend = async (fromChain: string, toChain: string) => {
	const ibc = (await import("osmojs")).ibc;

	const { transfer } = ibc.applications.transfer.v1.MessageComposer.withTypeUrl;
	const msg = transfer({
		sender: getAddress(fromChain),
		receiver: getAddress(toChain),
		memo: "",
		sourceChannel: "channel-6994",
		sourcePort: "transfer",
		timeoutHeight: { revisionHeight: BigInt(0), revisionNumber: BigInt(0) },
		token: {
			amount: "0.001",
			denom:
				"ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4",
		},
		timeoutTimestamp: BigInt((new Date().getTime() + 1000 * 60 * 5) * 1000000),
	});

	const txRaw = await sign(fromChain, [msg]);

	const res = await broadcast(fromChain, txRaw);

	return res;
};

export const compress = (address: string) =>
	`${address.slice(0, 4)}...${address.slice(-4)}`;

export default function Home() {
	const { connected, wallet, walletName } = useConnect();
	const { accountName } = useChains();

	const [{ fromChain, toChain }] = useQueryStates({
		fromChain: parseAsString,
		toChain: parseAsString,
	});

	return (
		<div className="flex w-full items-start justify-center pt-20 gap-8 flex-col max-w-3xl mx-auto">
			<h1 className="text-5xl font-semibold inline-flex items-center gap-4">
				Welcome{wallet && ", "}{" "}
				<span key={walletName} className="flex items-center gap-3">
					{wallet?.logoLight && (
						<Image
							src={wallet?.logoLight}
							alt={`${walletName} logo`}
							width={48}
							height={48}
						/>
					)}
					<span>{accountName}</span>
				</span>
			</h1>
			<div className="flex flex-col gap-8 w-full">
				<div className="flex flex-col gap-4">
					<TokenSelector direction="From" />
					<Button
						type="button"
						size="icon"
						variant="outline"
						className="rounded-full w-12 h-12 border-2 hover:border-neutral-800 group self-center"
					>
						<ArrowDown className="group-hover:text-neutral-800 transition-colors text-neutral-900" />
					</Button>
					<TokenSelector direction="To" />
				</div>
				{connected ? (
					<Button
						type="button"
						size="lg"
						variant="default"
						className="w-full h-14 text-xl"
						onClick={async () => {
							const res = await ibcSend(
								fromChain ?? "osmosis",
								toChain ?? "cosmoshub",
							);
							console.log(res);
						}}
					>
						Shoot for the stars ✨
					</Button>
				) : (
					<Drawer direction="right">
						<DrawerTrigger asChild>
							<Button
								type="button"
								size="lg"
								variant="default"
								className="w-full h-14 text-xl"
							>
								Connect wallet
							</Button>
						</DrawerTrigger>
						<WalletsDrawerContent />
					</Drawer>
				)}
			</div>
		</div>
	);
}

interface TokenSelectorProps {
	direction: "From" | "To";
}

function TokenSelector({ direction }: TokenSelectorProps) {
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
