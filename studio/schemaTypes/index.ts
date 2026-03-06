import product from './documents/product'
import category from './documents/category'
import brand from './documents/brand'
import color from './documents/color'
import size from './documents/size'
import material from './documents/material'
import agentConfig from './documents/agentConfig'
import productVariant from './objects/productVariant'
import price from './objects/price'
import seo from './objects/seo'

export const schemaTypes = [
  // Documents
  product,
  category,
  brand,
  color,
  size,
  material,
  agentConfig,
  // Objects
  productVariant,
  price,
  seo,
]
