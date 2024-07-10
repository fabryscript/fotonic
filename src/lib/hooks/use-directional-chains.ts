import { useQueryState } from "nuqs";
import type { Direction } from "../types";

export default function useDirectionalChains(direction: Direction) {
	const [chain, setChain] = useQueryState(
		direction === "From" ? "fromChain" : "toChain",
	);
	const [oppositeChain, setOppositeChain] = useQueryState(
		direction === "From" ? "toChain" : "fromChain",
	);

	return { chain, setChain, oppositeChain, setOppositeChain };
}
