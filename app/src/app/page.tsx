import {Chat} from '@/components/Chat'

export default function Home() {
  return (
    <main className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">Demo</div>
        <h1>
          Sanity as an
          <br />
          <span className="gradient-text">AI Agent Backend</span>
        </h1>
        <p className="hero-subtitle">
          This demo proves how structured content in Sanity powers intelligent AI agents.
          The shopping assistant uses the <strong>Agent Context MCP server</strong> to query
          a product catalog with GROQ — no vector databases, no embeddings, just structured content.
        </p>
      </section>

      {/* Architecture cards */}
      <section className="cards">
        <div className="card">
          <div className="card-icon">🏗️</div>
          <h3>Structured Content</h3>
          <p>
            Products, categories, brands, and variants — all modeled as typed documents
            in Sanity&apos;s Content Lake with rich references between them.
          </p>
        </div>
        <div className="card">
          <div className="card-icon">🔌</div>
          <h3>Agent Context MCP</h3>
          <p>
            Three read-only tools — <code>initial_context</code>, <code>groq_query</code>,
            and <code>schema_explorer</code> — give AI models precise access to your content.
          </p>
        </div>
        <div className="card">
          <div className="card-icon">🤖</div>
          <h3>AI SDK + Claude</h3>
          <p>
            Vercel AI SDK streams responses from Claude, which autonomously decides
            when and how to query the product catalog via MCP tools.
          </p>
        </div>
      </section>

      {/* Try it section */}
      <section className="try-it">
        <h2>Try the Assistant</h2>
        <p>
          Click the chat button in the bottom-right corner and ask about products.
          The AI will query Sanity in real-time to find what you&apos;re looking for.
        </p>
        <div className="example-queries">
          <span className="query-tag">&ldquo;Show me wool sweaters under $100&rdquo;</span>
          <span className="query-tag">&ldquo;What blue jackets do you have in size M?&rdquo;</span>
          <span className="query-tag">&ldquo;Compare your cashmere products&rdquo;</span>
          <span className="query-tag">&ldquo;What&apos;s on sale right now?&rdquo;</span>
        </div>
      </section>

      {/* Chat widget */}
      <Chat />
    </main>
  )
}
