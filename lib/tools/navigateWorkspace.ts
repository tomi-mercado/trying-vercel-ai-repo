import selectFilesToResumeChain from '@/lib/chains/selectFilesToResume';
import readWorkspace from './readWorkspace';
import getFileResume from './getFileResume';
import generateLearningFromFilesChain from '@/lib/chains/generateLearningFromFiles';

const navigateWorkspace = async (
  memoryName: string,
  context: string,
  input?: string
) => {
  const parsedContext = `${context}${
    input ? `\nThought to resolve the task: ${input}` : ''
  }`;
  const availableFiles = readWorkspace(memoryName);

  let filesToRead = JSON.parse(
    (
      await selectFilesToResumeChain.caller({
        context: parsedContext,
        files: availableFiles,
      })
    ).text
  ) as string[];

  if (filesToRead[0] === 'all') {
    filesToRead = availableFiles.split('\n');
  }

  const summaries = await Promise.all(
    filesToRead.map(async file => {
      const text = await getFileResume(memoryName, file);
      return text;
    })
  );

  const learnings = await generateLearningFromFilesChain.caller({
    context: parsedContext,
    files_resume: summaries.join('\n'),
  });

  return learnings.text as string;
};

export default navigateWorkspace;
