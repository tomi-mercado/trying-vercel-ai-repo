import { StreamingTextResponse, LangChainStream } from 'ai'

import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { DynamicStructuredTool } from 'langchain/tools'
import { z } from 'zod'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()
  console.log(messages)

  const { stream, handlers } = LangChainStream()

  const executor = await initializeAgentExecutorWithOptions(
    [
      new DynamicStructuredTool({
        name: 'email-sender',
        description:
          'Send an email. Receives a JSON with to, subject, and body fields.',
        func: async args => {
          console.log('===== EMAIL HERE =====')
          console.log(args)
          console.log('===== EMAIL HERE =====')
          return 'Email sent'
        },
        schema: z.object({
          to: z.string(),
          subject: z.string(),
          body: z.string()
        })
      })
    ],
    new ChatOpenAI({
      modelName: 'gpt-3.5-turbo-0613',
      temperature: 0,
      callbacks: [handlers],
      streaming: true
    }),
    {
      agentType: 'openai-functions',
      verbose: true
      // callbacks: [handlers]
    }
  )

  executor.run(
    'I need to send an formal email to my boss about the new project. His email is pepe@joseph.co. Should be formal. You have to create everything from scratch and send it.'
  )

  return new StreamingTextResponse(stream)
}
