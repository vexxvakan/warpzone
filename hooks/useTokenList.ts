import { useQuery } from "react-query"
import { queryClient } from "@services/client"
import { String } from "lodash"

export type TokenInfo = {
	id: string
	chain_id: string
	token_address: string
	symbol: string
	name: string
	ticker: String
	decimals: number
	logoURI: string
	tags: string[]
	denom: string
	native: boolean
}

export type TokenList = {
	name: string
	logoURI: string
	keywords: Array<string>
	timestamp: string
	base_token: TokenInfo
	tokens: Array<TokenInfo>
	tags: Record<
		string,
		{
			name: string
			description: string
		}
	>

	version: {
		major: number
		minor: number
		patch: number
	}
}

export const getCachedTokenList = () =>
	queryClient.getQueryCache().find("@token-list")?.state?.data as
		| TokenList
		| undefined

export const useTokenList = () => {
	const { data, isLoading } = useQuery<TokenList>(
		"@token-list",
		async () => {
			const response = await fetch("/token_list.json")
			return await response.json()
		},
		{
			onError(e) {
				console.error("Error loading token list:", e)
			},
			refetchOnMount: false,
			refetchIntervalInBackground: true,
			refetchInterval: 1000 * 60
		}
	)

	return [data, isLoading] as const
}
