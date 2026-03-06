'use client'

import {useChat} from '@ai-sdk/react'
import {useState, FormEvent} from 'react'
import {MessageList} from './MessageList'
import {ChatInput} from './ChatInput'
import {ExamplePrompts} from './ExamplePrompts'

export function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const {messages, sendMessage, status, error} = useChat()

  const isLoading = status === 'submitted' || status === 'streaming'

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({text: input})
    setInput('')
  }

  const handleExampleClick = (prompt: string) => {
    if (isLoading) return
    sendMessage({text: prompt})
  }

  return (
    <>
      <button
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? '\u2715' : '\ud83d\udcac'}
      </button>

      {isOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <h3>Shopping Assistant</h3>
            <p>Powered by Sanity Agent Context</p>
          </div>
          {error && (
            <div className="chat-error">
              <p>Error: {error.message}</p>
            </div>
          )}
          <MessageList messages={messages} isLoading={isLoading} />
          {messages.length === 0 && !isLoading && (
            <ExamplePrompts onSelect={handleExampleClick} />
          )}
          <ChatInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      )}
    </>
  )
}
