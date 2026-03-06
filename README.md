# Sanity Agent Context Demo

> **Proving Sanity as an AI agent backend** — structured content meets intelligent assistants.

This demo shows how [Sanity](https://www.sanity.io) can serve as the backend for AI agents using the **Agent Context MCP server**. An AI-powered shopping assistant queries a product catalog in real-time, demonstrating how structured content and GROQ make Sanity an ideal data layer for agentic applications.

![Architecture](https://img.shields.io/badge/Next.js_15-black?style=flat&logo=next.js) ![Sanity](https://img.shields.io/badge/Sanity_v5-F03E2F?style=flat&logo=sanity) ![AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-000?style=flat)

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Next.js App   │────▶│  Vercel AI SDK   │────▶│   Claude (Anthropic)│
│   (Frontend)    │     │  + MCP Client    │     │                     │
└─────────────────┘     └──────┬───────────┘     └──────────┬──────────┘
                               │                            │
                               │  Streamable HTTP           │ Tool calls
                               ▼                            ▼
                        ┌──────────────────────────────────────┐
                        │   Sanity Agent Context MCP Server    │
                        │                                      │
                        │  ┌──────────┐ ┌──────────┐ ┌──────┐ │
                        │  │ initial  │ │  groq    │ │schema│ │
                        │  │ context  │ │  query   │ │explorer│ │
                        │  └──────────┘ └──────────┘ └──────┘ │
                        └──────────────────┬───────────────────┘
                                           │
                                           ▼
                        ┌──────────────────────────────────────┐
                        │         Sanity Content Lake           │
                        │   (Products, Categories, Brands...)   │
                        └──────────────────────────────────────┘
```

### How It Works

1. **User asks a question** in the chat widget (e.g., "Show me wool sweaters under $100")
2. **Next.js API route** connects to Claude via the Vercel AI SDK
3. **Claude uses MCP tools** provided by the Sanity Agent Context server:
   - `initial_context` — Gets an overview of available content types and sample data
   - `groq_query` — Executes GROQ queries against the Sanity Content Lake
   - `schema_explorer` — Inspects specific schema types to understand field structures
4. **Results stream back** to the user with specific product recommendations

### Key Design Principles

- **Read-only**: The Agent Context MCP server only provides read access — agents cannot modify content
- **Scoped**: Each MCP endpoint is scoped to a specific project, dataset, and context configuration
- **Structured**: GROQ queries return typed, structured data — not unstructured text
- **Editor-controlled**: System prompts are stored as Sanity documents, editable by content teams without code changes

## Project Structure

```
├── app/                    # Next.js 15 App Router frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/chat/   # AI chat API route (AI SDK + MCP)
│   │   │   ├── layout.tsx  # Root layout
│   │   │   └── page.tsx    # Homepage with chat widget
│   │   ├── components/     # Chat UI components
│   │   └── lib/            # Sanity client config
│   └── package.json
├── studio/                 # Sanity Studio v5
│   ├── schemaTypes/        # Product catalog schema
│   │   ├── documents/      # Product, Category, Brand, etc.
│   │   └── objects/        # ProductVariant, Price, SEO
│   ├── seed/               # Sample data import script
│   ├── sanity.config.ts    # Studio config with Agent Context plugin
│   └── package.json
├── package.json            # Root workspace config
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- A Sanity account with the Agent Context feature enabled
- An Anthropic API key

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create `app/.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=yfkwnwo8
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=<your-sanity-read-token>
SANITY_CONTEXT_MCP_URL=https://api.sanity.io/v2024-01-01/agent-context/yfkwnwo8/production/<your-context-slug>
ANTHROPIC_API_KEY=<your-anthropic-api-key>
AGENT_CONFIG_SLUG=default
```

### 3. Import Sample Data

```bash
# Set your Sanity token
export AGENT_CONTEXT_TOKEN=<your-sanity-write-token>

# Import the product catalog
pnpm import-sample-data
```

This creates 20 products across 5 brands, 6 categories, with colors, sizes, materials, and variants.

### 4. Configure Agent Context in Sanity Studio

1. Start the studio: `cd studio && pnpm dev`
2. Open the studio at `http://localhost:3333`
3. Navigate to **Agent Context** in the sidebar
4. Create a new context configuration with your desired scope
5. Copy the MCP URL slug and update your `.env.local`

### 5. Start Development

```bash
pnpm dev
```

This starts both the Sanity Studio (port 3333) and the Next.js app (port 3000) concurrently.

### 6. Try the Chat

Open `http://localhost:3000` and click the chat widget. Try prompts like:

- "Show me wool sweaters under $100"
- "What blue jackets do you have in size M?"
- "Compare your cashmere products"
- "What's on sale right now?"

## Environment Variables Reference

| Variable | Description | Where |
|----------|-------------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | `app/.env.local` |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name | `app/.env.local` |
| `SANITY_API_READ_TOKEN` | Sanity API token (read access) | `app/.env.local` |
| `SANITY_CONTEXT_MCP_URL` | Agent Context MCP endpoint URL | `app/.env.local` |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude | `app/.env.local` |
| `AGENT_CONFIG_SLUG` | Slug of the agent config document | `app/.env.local` |
| `AGENT_CONTEXT_TOKEN` | Sanity write token (for data import only) | Shell env |

## How Agent Context MCP Works

The Sanity Agent Context MCP server exposes three tools via the [Model Context Protocol](https://modelcontextprotocol.io):

### `initial_context`
Returns an overview of the content lake: available document types, document counts, and sample documents. This gives the AI model a "lay of the land" before making specific queries.

### `groq_query`
Executes [GROQ](https://www.sanity.io/docs/groq) queries against the Sanity Content Lake. GROQ is Sanity's query language — it supports filtering, projections, joins, and aggregations. This is the primary tool for answering user questions.

### `schema_explorer`
Returns the full schema definition for a specific document or object type. The AI uses this to understand field names, types, and relationships before constructing GROQ queries.

All three tools are **read-only** — the agent cannot create, update, or delete content.

## License

MIT
