import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { model } from '@/lib/config';
import { generateLearningFromFilesTemplates } from '@/lib/templates';
import chainCaller from './chainCaller';

interface Args {
  context: string;
  files_resume: string;
}

const chain = new LLMChain({
  llm: model,
  prompt: PromptTemplate.fromTemplate(generateLearningFromFilesTemplates[0]),
});

const caller = (args: Args) => chainCaller(chain, args);

const generateLearningFromFilesChain = {
  chain,
  caller,
};

export default generateLearningFromFilesChain;
