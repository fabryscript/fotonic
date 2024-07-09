"use client";

import WalletsDrawerContent from "@/components/drawers/wallets";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useChains, useConnect } from "@quirks/react";
import { ArrowDown } from "lucide-react";

export default function Home() {
	const { connected } = useConnect();
	const { accounts } = useChains();

	return (
		<div className="flex w-full items-start justify-center h-screen gap-8 flex-col max-w-3xl mx-auto">
			<h1 className="text-5xl font-semibold">
				Welcome, {JSON.stringify(accounts)}
			</h1>
			<div className="flex flex-col gap-4 w-full">
				<div className="flex items-center justify-between h-[200px] rounded-md w-full py-10">
					<div className="flex flex-col gap-2">
						<Input className="h-24 w-full text-5xl" placeholder="0" />
					</div>
					<div className="flex items-center gap-4">
						<div className="flex flex-col gap-2 justify-end text-right whitespace-nowrap">
							<span className="text-3xl font-semibold">ATOM</span>
							<span className="text-xl text-neutral-500 font-medium">
								Comos Hub
							</span>
						</div>
						<div className="rounded-full w-24 h-24 bg-neutral-900" />
					</div>
				</div>
				<Button
					type="button"
					size="icon"
					variant="outline"
					className="rounded-full w-12 h-12 border-2 hover:border-neutral-800 group self-center"
				>
					<ArrowDown className="group-hover:text-neutral-800 transition-colors text-neutral-900" />
				</Button>
				<div className="flex items-center justify-between h-[200px] rounded-md w-full py-10">
					<div className="flex flex-col gap-2">
						<Input className="h-24 w-full text-5xl" placeholder="0" />
					</div>
					<div className="flex items-center gap-4">
						<div className="flex flex-col gap-2 justify-end text-right whitespace-nowrap">
							<span className="text-3xl font-semibold">TIA</span>
							<span className="text-xl text-neutral-500 font-medium">
								Osmosis
							</span>
						</div>
						<div className="rounded-full w-24 h-24 bg-neutral-900" />
					</div>
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
