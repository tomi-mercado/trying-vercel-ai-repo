import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { model } from '@/lib/config';
import { resumeAnythingTemplates } from '@/lib/templates';
import chainCaller from './chainCaller';

interface Args {
  text: string;
}

const chain = new LLMChain({
  llm: model,
  prompt: PromptTemplate.fromTemplate(resumeAnythingTemplates[0]),
});

const caller = (args: Args) => chainCaller(chain, args);

const resumeTextChain = {
  chain,
  caller,
};

export default resumeTextChain;
