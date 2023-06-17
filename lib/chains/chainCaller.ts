import getTextChunks from '@/lib/helpers/getTextChunks';
import { getTokensAmount } from '@/lib/helpers/getTokens';
import { LLMChain } from 'langchain/chains';
import resumeTextChain from './resumeText';

const MAX_TOKENS = 4000;

const formatCallArgs = async (
  chain: LLMChain,
  callArgs: object
): Promise<object> => {
  const formattedPrompt = await chain.prompt.format(callArgs);
  const tokens = await getTokensAmount(formattedPrompt);

  if (tokens < MAX_TOKENS) {
    return callArgs;
  }

  const keyToUpdate = Object.entries(callArgs).reduce((acc, [key, value]) => {
    if (!acc) {
      return key;
    }

    const accValue = callArgs[acc as keyof typeof callArgs] as string;
    if (value.length > accValue.length) {
      return key;
    }
    return acc;
  }, null as string | null) as string;

  let chunks: string[] = [];
  try {
    chunks = await getTextChunks(
      callArgs[keyToUpdate as keyof typeof callArgs] as string,
      MAX_TOKENS
    );
  } catch (e) {
    chunks = (callArgs[keyToUpdate as keyof typeof callArgs] as string)
      .split('')
      .reduce(
        (acc, char) => {
          if (acc[acc.length - 1].length > 2000) {
            acc.push('');
          }
          acc[acc.length - 1] += char;
          return acc;
        },
        ['']
      );
  }

  const newValueParts = await Promise.all(
    chunks.map(async text => {
      const response = await resumeTextChain.caller({ text });
      return response.text;
    })
  );

  const newValue = newValueParts.join('\n');

  const newTokens = await getTokensAmount(
    await chain.prompt.format({
      ...callArgs,
      [keyToUpdate]: newValue
    })
  );

  if (newTokens > MAX_TOKENS) {
    return formatCallArgs(chain, {
      ...callArgs,
      [keyToUpdate]: newValue
    });
  }

  return {
    ...callArgs,
    [keyToUpdate]: newValue
  };
};

async function chainCaller<T extends object>(
  chain: LLMChain,
  callArgs: T,
  disableFormat = false
) {
  const formattedCallArgs = disableFormat
    ? callArgs
    : await formatCallArgs(chain, callArgs);

  if (
    disableFormat &&
    (await getTokensAmount(await chain.prompt.format(formattedCallArgs))) >
      MAX_TOKENS
  ) {
    return {
      text: '[ERROR] [IGNORE THIS]'
    };
  }

  return chain.call(formattedCallArgs);
}

export default chainCaller;
