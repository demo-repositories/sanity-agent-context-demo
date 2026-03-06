import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'size',
  title: 'Size',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required(), description: 'e.g. Small, Medium, Large'}),
    defineField({name: 'code', title: 'Code', type: 'string', validation: (r) => r.required(), description: 'e.g. S, M, L, XL'}),
    defineField({name: 'sortOrder', title: 'Sort Order', type: 'number'}),
  ],
})
