import type {UIMessage} from 'ai'
import {isToolUIPart} from 'ai'

interface MessageListProps {
  messages: UIMessage[]
  isLoading: boolean
}

export function MessageList({messages, isLoading}: MessageListProps) {
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="message-list empty">
        <div className="empty-state">
          <p>👋 Hi! I&apos;m your AI shopping assistant.</p>
          <p>Ask me about our products &mdash; I can search by category, price, size, color, material, and more.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.role}`}>
          <div className="message-avatar">
            {message.role === 'user' ? '👤' : '🤖'}
          </div>
          <div className="message-content">
            {message.parts.map((part, i) => {
              if (part.type === 'text') {
                return <p key={i}>{part.text}</p>
              }
              if (isToolUIPart(part)) {
                const toolName = 'toolName' in part ? part.toolName : part.type.replace('tool-', '')
                return (
                  <div key={i} className="tool-call">
                    <span className="tool-name">🔧 {toolName}</span>
                    {part.state === 'output-available' && (
                      <span className="tool-status">✓</span>
                    )}
                    {(part.state === 'input-available' || part.state === 'input-streaming') && (
                      <span className="tool-status loading">⏳</span>
                    )}
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
      ))}
      {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
        <div className="message assistant">
          <div className="message-avatar">🤖</div>
          <div className="message-content">
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
