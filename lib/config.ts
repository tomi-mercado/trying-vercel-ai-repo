import { OpenAI } from 'langchain/llms/openai'
import dotenv from 'dotenv'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

dotenv.config()

export const model = new OpenAI({
  temperature: 0,
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: process.env.OPENAI_API_KEY
})

export const vectorDimensions = 1536

export const embeddings = new OpenAIEmbeddings({
  maxRetries: 1
})
