import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { model } from '@/lib/config';
import { selectFilesToResumeTemplates } from '@/lib/templates';
import chainCaller from './chainCaller';

interface Args {
  context: string;
  files: string;
}

const chain = new LLMChain({
  llm: model,
  prompt: PromptTemplate.fromTemplate(selectFilesToResumeTemplates[0]),
});

const caller = (args: Args) => chainCaller(chain, args);

const selectFilesToResumeChain = {
  chain,
  caller,
};

export default selectFilesToResumeChain;
