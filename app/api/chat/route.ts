// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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'
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'ft:gpt-3.5-turbo-0125:chu:chuexperiment:B7oPJxhO',
    stream: true,
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          "You analyze customer feedback and predict churn likelihood based on sentiment and key indicators."
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
