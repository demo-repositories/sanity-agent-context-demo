import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'agent.config',
  title: 'Agent Config',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}, validation: (r) => r.required()}),
    defineField({
      name: 'systemPrompt',
      title: 'System Prompt',
      type: 'text',
      rows: 20,
      description: 'The system prompt for the AI agent. Editors can modify this without code changes.',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'slug.current'},
  },
})
