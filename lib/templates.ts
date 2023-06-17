export const resumeAnythingTemplates = [
  `We introduce Extreme TLDR generation, a new form of extreme summarization for paragraphs. TLDR generation involves high source compression, removes stop words and summarizes the paragraph whilst retaining meaning. The result is the shortest possible summary that retains all of the original meaning and context of the paragraph. You have to create a summary of the Paragraph using this Extreme TLDR generation. If there is no text, just response with "Empty File".

  Paragraph:
  
  {text}
  
  Extreme TLDR:`,
  `Paragraph:
{text}

Extreme TLDR: \
`,
  `Make a summary for this text. Do it short and concise:
  {text}

  Summary: \
  `,
];

export const selectFilesToResumeTemplates = [
  `\
{context}

Given this list of files, select the files that are most relevant to the task. Max of 5 files. Return just the JSON array, in the following format, starting with [ and ending with ].
If you need to read all files, return ["all"].
If you don't need to read any files, return [].

Files:
{files}

Array of files: \
`,
];

export const generateLearningFromFilesTemplates = [
  `\
{context}

Here is a resume of the files you selected to read to complete the task:
{files_resume}

Return learnings from these files.

Learnings: \
`,
];
