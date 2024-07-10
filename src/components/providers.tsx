"use client";

import { LOADED_ASSETS_LIST, LOADED_CHAINS } from "@/lib/configs";
import { generateConfig } from "@quirks/next";
import { QuirksConfig, QuirksNextProvider } from "@quirks/react";
import type { Config } from "@quirks/store";
import {
	cosmostationExtension,
	keplrExtension,
	leapExtension,
} from "@quirks/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

const config: Config = generateConfig({
	wallets: [keplrExtension, leapExtension, cosmostationExtension],
	chains: LOADED_CHAINS,
	assetsLists: LOADED_ASSETS_LIST,
	autoSuggestions: false,
});

export const Provider = ({ children }: PropsWithChildren<unknown>) => {
	const qc = new QueryClient();
	return (
		<QuirksNextProvider>
			<QueryClientProvider client={qc}>
				<QuirksConfig config={config}>{children}</QuirksConfig>
			</QueryClientProvider>
		</QuirksNextProvider>
	);
};
