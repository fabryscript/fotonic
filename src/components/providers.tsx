"use client";

import {
	cosmoshub,
	cosmoshubtestnetAssetList,
	osmosis,
	osmosistestnetAssetList,
} from "@nabla-studio/chain-registry";
import { QuirksConfig, QuirksNextProvider } from "@quirks/react";
import type { Config } from "@quirks/store";
import {
	cosmostationExtension,
	keplrExtension,
	leapExtension,
} from "@quirks/wallets";
import type { PropsWithChildren } from "react";

const config: Config = {
	wallets: [keplrExtension, leapExtension, cosmostationExtension],
	chains: [osmosis, cosmoshub],
	assetsLists: [osmosistestnetAssetList, cosmoshubtestnetAssetList],
};

export const Provider = ({ children }: PropsWithChildren<unknown>) => {
	return (
		<QuirksNextProvider>
			<QuirksConfig config={config}>{children}</QuirksConfig>
		</QuirksNextProvider>
	);
};
