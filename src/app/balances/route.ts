import { LOADED_CHAINS } from "@/lib/configs";
import type { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, _: NextResponse) {
	const queryURL = new URL(req.url);

	const chain = queryURL.searchParams.get("chain");
	const denom = queryURL.searchParams.get("denom");
	const decimals = queryURL.searchParams.get("decimals");
	const address = queryURL.searchParams.get("address");

	if (!chain || !denom || !decimals || !address)
		throw new BalanceQueryError("Chain, denom, decimals or address missing");

	const chainInfos = LOADED_CHAINS.find(
		(loadedChain) => loadedChain.chain_name === chain,
	);

	if (!chainInfos)
		throw new BalanceQueryError(
			`Could not query chain infos from given chain ${chain}`,
		);

	const chainApiEndpoints = chainInfos.apis?.rest?.[0].address;

	if (!chainApiEndpoints)
		throw new BalanceQueryError(
			`Could not find API endpoints for chain ${chain}`,
		);

	const { osmosis } = await import("osmojs");
	const { createLCDClient } = osmosis.ClientFactory;

	const client = await createLCDClient({
		restEndpoint: chainApiEndpoints,
	});

	const { balance } = await client.cosmos.bank.v1beta1.balance({
		address,
		denom,
	});

	const amount = +(balance?.amount ?? 0);

	return Response.json({
		amount: amount * 1 * 10 ** -+decimals,
	});
}

class BalanceQueryError extends Error {}
