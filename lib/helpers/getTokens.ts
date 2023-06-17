import { encode } from 'gpt-3-encoder'

export const getTokensAmount = async (prompt: string) => {
  const numTokens = encode(prompt).length
  return numTokens
}
