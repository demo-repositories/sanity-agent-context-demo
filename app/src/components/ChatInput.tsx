import {FormEvent} from 'react'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  handleSubmit: (e: FormEvent) => void
  isLoading: boolean
}

export function ChatInput({input, setInput, handleSubmit, isLoading}: ChatInputProps) {
  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isLoading ? 'Thinking...' : 'Ask about our products...'}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading || !input.trim()}>
        {isLoading ? '...' : '\u2192'}
      </button>
    </form>
  )
}
