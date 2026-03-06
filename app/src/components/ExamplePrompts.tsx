interface ExamplePromptsProps {
  onSelect: (prompt: string) => void
}

const EXAMPLES = [
  'Show me wool sweaters under $100',
  'What blue jackets do you have in size M?',
  'Compare your cashmere products',
  "What's on sale right now?",
]

export function ExamplePrompts({onSelect}: ExamplePromptsProps) {
  return (
    <div className="example-prompts">
      <p className="example-prompts-label">Try asking:</p>
      {EXAMPLES.map((prompt) => (
        <button
          key={prompt}
          className="example-prompt"
          onClick={() => onSelect(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
