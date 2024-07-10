import { selectedAssetsStore } from "@/stores/selectedAssets";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@xstate/react";
import { useState } from "react";
import { cn } from "../utils";

// const numericalCheck = (input: string) => !!input && !/^0*$/.test(input);

export function useAmountValidation() {
	const [styles, setStyles] = useState<string>();
	const [errorMessage, setErrorMessage] = useState<string>();

	const selectedAsset = useSelector(selectedAssetsStore, (s) => s.context.from);

	const { data: balance } = useQuery<unknown, Error, { amount: number }>({
		queryKey: ["balance", selectedAsset?.base],
	});

	function validate({
		inputValue,
	}: {
		inputValue: string;
	}) {
		if (inputValue.length > 32) {
			setStyles(cn("text-red-400"));
			setErrorMessage("Input amount exceeds maximum cap");
			return;
		}

		// if (!numericalCheck(inputValue)) {
		// 	setStyles(cn("text-red-400"));
		// 	setErrorMessage("Input amount cannot be only zeros");
		// 	return;
		// }

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		if (+inputValue > balance?.amount!) {
			setStyles(cn("text-red-400"));
			setErrorMessage("Insufficient balance");
			return;
		}
	}

	return { validate, styles, errorMessage };
}
