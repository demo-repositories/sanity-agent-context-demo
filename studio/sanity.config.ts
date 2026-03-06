import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {agentContextPlugin, AGENT_CONTEXT_SCHEMA_TYPE_NAME} from '@sanity/agent-context/studio'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Agent Context Demo',
  projectId: 'yfkwnwo8',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== AGENT_CONTEXT_SCHEMA_TYPE_NAME,
            ),
            S.divider(),
            S.documentTypeListItem(AGENT_CONTEXT_SCHEMA_TYPE_NAME).title('Agent Context'),
          ]),
    }),
    visionTool(),
    agentContextPlugin(),
  ],
  schema: {
    types: schemaTypes,
  },
})
