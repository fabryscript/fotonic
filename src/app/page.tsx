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
import { useChains, useConnect } from "@quirks/react";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { useQueryState } from "nuqs";
import { useState } from "react";

export const compress = (address: string) =>
	`${address.slice(0, 4)}...${address.slice(-4)}`;

export default function Home() {
	const { connected, wallet, walletName } = useConnect();
	const { accounts } = useChains();

	return (
		<div className="flex w-full items-start justify-center pt-20 gap-8 flex-col max-w-3xl mx-auto">
			<h1 className="text-5xl font-semibold inline-flex items-center gap-4">
				Welcome{accounts.length > 0 && ", "}
				{accounts.map(({ bech32Address, name }) => (
					<span key={bech32Address} className="flex items-center gap-3">
						{wallet?.logoLight && (
							<Image
								src={wallet?.logoLight}
								alt={`${walletName} logo`}
								width={48}
								height={48}
							/>
						)}
						<span>{name}</span>
					</span>
				))}
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
					>
						Review transfer
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

	const [amount, setAmount] = useState<string>();

	return (
		<div className="flex flex-col items-center justify-between h-[200px] rounded-md w-full py-10">
			<div className="flex items-center w-full justify-between gap-12">
				<Select value={chain ? chain : undefined} onValueChange={setChain}>
					<SelectTrigger>
						<SelectValue placeholder={`${direction} chain`} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="osmosis">Osmosis</SelectItem>
						<SelectItem value="cosmos">Cosmos Hub</SelectItem>
					</SelectContent>
				</Select>
				{/**disable if no chain first */}
				<Select value={asset ? asset : undefined} onValueChange={setAsset}>
					<SelectTrigger>
						<SelectValue placeholder={`${direction} asset`} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="OSMO">Osmosis</SelectItem>
						<SelectItem value="TIA">Celestia</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="flex flex-col w-full">
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
			</div>
		</div>
	);
}
