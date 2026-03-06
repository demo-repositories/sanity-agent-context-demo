import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'productVariant',
  title: 'Product Variant',
  type: 'object',
  fields: [
    defineField({
      name: 'color',
      title: 'Color',
      type: 'reference',
      to: [{type: 'color'}],
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'size'}]}],
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      color: 'color.title',
      available: 'available',
    },
    prepare({color, available}) {
      return {
        title: color || 'No color',
        subtitle: available ? 'In stock' : 'Out of stock',
      }
    },
  },
})
