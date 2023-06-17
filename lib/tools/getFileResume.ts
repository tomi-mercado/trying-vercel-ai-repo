import path from 'path';
import fs from 'fs';
import resumeTextChain from '@/lib/chains/resumeText';

const workspaceDir = process.env.WORKSPACE_DIR || '/workspace';

const getFileResume = async (memoryName: string, filePath: string) => {
  const pathToRead = path.join(workspaceDir, `${memoryName}/${filePath}`);

  if (!fs.existsSync(pathToRead)) {
    throw new Error(`File ${filePath} does not exist in workspace.`);
  }

  const fileContent = fs.readFileSync(pathToRead, 'utf-8');

  if (fileContent.trim() === '') {
    return `\
    File: ${filePath}
    Resume: [EMPTY FILE]`;
  }

  const fileResume = await resumeTextChain.caller({
    text: fileContent,
  });

  return `\
  File: ${filePath}
  Resume:
  ${fileResume.text}`;
};

export default getFileResume;
