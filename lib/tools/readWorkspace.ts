import fs from 'fs';
import path from 'path';

const workspaceDir = process.env.WORKSPACE_DIR || '/workspace';

interface DirectoryContent {
  [key: string]: DirectoryContent[] | string[];
}

function formatDirectoryContent(
  contents: (DirectoryContent | string)[]
): string {
  let result = '';

  function traverse(content: DirectoryContent | string, prefix: string = '') {
    if (typeof content === 'string') {
      result += `${prefix}${content}\n`;
    } else {
      const directoryName = Object.keys(content)[0];
      const subContent = content[directoryName];

      const newPrefix = prefix
        ? `${prefix}${directoryName}/`
        : `${directoryName}/`;

      subContent.forEach(item => {
        traverse(item, newPrefix);
      });
    }
  }

  contents.forEach(item => {
    traverse(item);
  });

  return result;
}

function getContents(memoryName: string): (DirectoryContent | string)[] {
  const contents: (DirectoryContent | string)[] = [];
  const dir = memoryName.startsWith(workspaceDir)
    ? memoryName
    : path.join(workspaceDir, memoryName);

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const fileStats = fs.statSync(filePath);

    if (fileStats.isDirectory()) {
      const subDirectoryContent = getContents(filePath);
      contents.push({ [file]: subDirectoryContent } as DirectoryContent);
    } else {
      contents.push(file);
    }
  });

  return contents;
}

const readWorkspace = (memoryName: string) => {
  const contents = getContents(memoryName);
  const formattedContents = formatDirectoryContent(contents);

  return formattedContents;
};

export default readWorkspace;
