"use client";

import WalletsDrawerContent from "./drawers/wallets";
import { Button } from "./ui/button";
import { Drawer, DrawerTrigger } from "./ui/drawer";

export default function Navbar() {
	return (
		<div className="flex items-center justify-between py-4">
			<div />
			<Drawer direction="right">
				<DrawerTrigger asChild>
					<Button type="button" size="lg" variant="default">
						Wallets
					</Button>
				</DrawerTrigger>
				<WalletsDrawerContent />
			</Drawer>
		</div>
	);
}
