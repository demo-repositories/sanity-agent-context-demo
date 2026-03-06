import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'price',
  title: 'Price',
  type: 'object',
  fields: [
    defineField({name: 'amount', title: 'Amount', type: 'number', validation: (r) => r.required().min(0)}),
    defineField({name: 'currency', title: 'Currency', type: 'string', initialValue: 'USD', options: {list: ['USD', 'EUR', 'GBP']}}),
    defineField({name: 'compareAtPrice', title: 'Compare at Price', type: 'number', description: 'Original price if on sale'}),
  ],
})
