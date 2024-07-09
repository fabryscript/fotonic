"use client";

import WalletsDrawerContent from "@/components/drawers/wallets";
import TokenSelector from "@/components/home/token-selector";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { useIbcSend } from "@/lib/ibc-send";
import { useChains, useConnect } from "@quirks/react";
import { ArrowDown, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { parseAsString, useQueryStates } from "nuqs";
import { useMemo } from "react";

export const compress = (address: string) =>
	`${address.slice(0, 4)}...${address.slice(-4)}`;

export default function Home() {
	const { connected, wallet, walletName } = useConnect();
	const { accountName } = useChains();

	const [{ fromChain, toChain }] = useQueryStates({
		fromChain: parseAsString,
		toChain: parseAsString,
	});

	const { ibcSend, isLoading } = useIbcSend({
		fromChain,
		toChain,
		amount: "0.01",
		denom: "uuosmo",
		sourceChannel: "",
		sourcePort: "",
	});

	const isButtonDisabled = useMemo(
		() => !fromChain || !toChain || !connected || isLoading,
		[connected, fromChain, isLoading, toChain],
	);

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
						disabled={isButtonDisabled}
						type="button"
						size="lg"
						variant="default"
						className="w-full h-14 text-xl"
						onClick={async () => {
							await ibcSend();
						}}
					>
						Shoot for the stars{" "}
						{isLoading ? <Loader2Icon className="ml-2 animate-spin" /> : "✨"}
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
