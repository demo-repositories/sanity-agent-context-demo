import {createMCPClient} from '@ai-sdk/mcp'
import {anthropic} from '@ai-sdk/anthropic'
import {streamText, stepCountIs} from 'ai'
import {createClient} from '@sanity/client'

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})

const DEFAULT_SYSTEM_PROMPT = `You are a helpful shopping assistant for a clothing store. You have access to the product catalog through structured content tools.

When a customer asks about products:
1. First use initial_context to understand the available content types and schema
2. Use groq_query to find products matching their criteria with precise filters
3. Use schema_explorer if you need to understand a specific type's fields

Always provide specific product details (name, price, available sizes/colors) when answering.
Be conversational and helpful. If you can't find exactly what they're looking for, suggest alternatives.`

export async function POST(req: Request) {
  const {messages} = await req.json()

  // Fetch system prompt from Sanity (editable by editors)
  let systemPrompt = DEFAULT_SYSTEM_PROMPT
  try {
    const agentConfig = await sanityClient.fetch(
      `*[_type == "agent.config" && slug.current == $slug][0]{systemPrompt}`,
      {slug: process.env.AGENT_CONFIG_SLUG || 'default'}
    )
    if (agentConfig?.systemPrompt) {
      systemPrompt = agentConfig.systemPrompt
    }
  } catch (e) {
    console.error('Failed to fetch agent config:', e)
  }

  // Connect to Agent Context MCP
  const mcpClient = await createMCPClient({
    transport: {
      type: 'http',
      url: process.env.SANITY_CONTEXT_MCP_URL!,
      headers: {
        Authorization: `Bearer ${process.env.SANITY_API_READ_TOKEN}`,
      },
    },
  })

  try {
    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      system: systemPrompt,
      messages,
      tools: await mcpClient.tools(),
      stopWhen: stepCountIs(10),
    })

    return result.toUIMessageStreamResponse()
  } finally {
    await mcpClient.close()
  }
}
