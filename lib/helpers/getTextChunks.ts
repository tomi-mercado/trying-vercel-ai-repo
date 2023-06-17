import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const getTextChunks = (text: string, chunkSize: number, chunkOverlap = 200) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap
  })

  return splitter.splitText(text)
}

export default getTextChunks
