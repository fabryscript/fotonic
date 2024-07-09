import { useConfig, useConnect } from "@quirks/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";

export default function WalletsDrawerContent() {
	const { wallets } = useConfig();
	const { connect, connected, disconnect, walletName } = useConnect();

	const router = useRouter();

	return (
		<DrawerContent className="px-4">
			<DrawerHeader className="px-0">
				<DrawerTitle className="text-2xl">Wallets</DrawerTitle>
			</DrawerHeader>
			<div className="flex flex-col gap-2">
				{wallets.map(
					({
						options: { pretty_name, wallet_name, website },
						logoLight,
						logoDark,
						injected,
					}) => (
						<button
							type="button"
							key={wallet_name}
							className="flex items-center flex-col gap-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors py-4 px-5"
							onClick={() => {
								if (connected && walletName === wallet_name) {
									disconnect();
									router.refresh();
								} else {
									if (injected) {
										disconnect();
										connect(wallet_name);
										router.refresh();
									} else if (website) {
										window.open(website);
									}
								}
							}}
						>
							<Image
								src={logoLight ?? logoDark ?? ""}
								alt={`${wallet_name} logo`}
								width={48}
								height={48}
							/>
							<span>{pretty_name}</span>
							{walletName === wallet_name ? (
								<span>Connected</span>
							) : (
								<span className="text-green-500">Connect</span>
							)}
						</button>
					),
				)}
			</div>
		</DrawerContent>
	);
}
