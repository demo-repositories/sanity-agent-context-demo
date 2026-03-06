import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'yfkwnwo8',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.AGENT_CONTEXT_TOKEN,
  useCdn: false,
})

if (!process.env.AGENT_CONTEXT_TOKEN) {
  console.error('Error: AGENT_CONTEXT_TOKEN environment variable is required.')
  console.error('Set it with: export AGENT_CONTEXT_TOKEN=<your-sanity-write-token>')
  process.exit(1)
}

// ── Reference Data ──────────────────────────────────────────────────────────

const brands = [
  {_id: 'brand-alpine-wear', _type: 'brand', name: 'Alpine Wear', slug: {_type: 'slug', current: 'alpine-wear'}, description: 'Premium mountain-inspired apparel for the modern adventurer.'},
  {_id: 'brand-urban-thread', _type: 'brand', name: 'Urban Thread', slug: {_type: 'slug', current: 'urban-thread'}, description: 'Contemporary streetwear with a focus on sustainable materials.'},
  {_id: 'brand-coastal-co', _type: 'brand', name: 'Coastal Co', slug: {_type: 'slug', current: 'coastal-co'}, description: 'Relaxed coastal style for everyday living.'},
  {_id: 'brand-summit-gear', _type: 'brand', name: 'Summit Gear', slug: {_type: 'slug', current: 'summit-gear'}, description: 'Technical outerwear built for peak performance.'},
  {_id: 'brand-meadow-co', _type: 'brand', name: 'Meadow & Co', slug: {_type: 'slug', current: 'meadow-co'}, description: 'Elegant countryside-inspired fashion with artisanal craftsmanship.'},
]

const categories = [
  {_id: 'category-sweaters', _type: 'category', title: 'Sweaters', slug: {_type: 'slug', current: 'sweaters'}, description: 'Cozy knits and pullovers for every season.'},
  {_id: 'category-jackets', _type: 'category', title: 'Jackets', slug: {_type: 'slug', current: 'jackets'}, description: 'Outerwear from lightweight layers to heavy-duty coats.'},
  {_id: 'category-tshirts', _type: 'category', title: 'T-Shirts', slug: {_type: 'slug', current: 't-shirts'}, description: 'Essential tees in premium fabrics.'},
  {_id: 'category-pants', _type: 'category', title: 'Pants', slug: {_type: 'slug', current: 'pants'}, description: 'Trousers, chinos, and joggers for any occasion.'},
  {_id: 'category-dresses', _type: 'category', title: 'Dresses', slug: {_type: 'slug', current: 'dresses'}, description: 'From casual day dresses to elegant evening wear.'},
  {_id: 'category-accessories', _type: 'category', title: 'Accessories', slug: {_type: 'slug', current: 'accessories'}, description: 'Scarves, hats, belts, and more.'},
]

const colors = [
  {_id: 'color-black', _type: 'color', title: 'Black', slug: {_type: 'slug', current: 'black'}, hex: '#000000'},
  {_id: 'color-white', _type: 'color', title: 'White', slug: {_type: 'slug', current: 'white'}, hex: '#FFFFFF'},
  {_id: 'color-navy', _type: 'color', title: 'Navy', slug: {_type: 'slug', current: 'navy'}, hex: '#001F3F'},
  {_id: 'color-red', _type: 'color', title: 'Red', slug: {_type: 'slug', current: 'red'}, hex: '#E74C3C'},
  {_id: 'color-green', _type: 'color', title: 'Green', slug: {_type: 'slug', current: 'green'}, hex: '#2ECC71'},
  {_id: 'color-blue', _type: 'color', title: 'Blue', slug: {_type: 'slug', current: 'blue'}, hex: '#3498DB'},
  {_id: 'color-gray', _type: 'color', title: 'Gray', slug: {_type: 'slug', current: 'gray'}, hex: '#95A5A6'},
  {_id: 'color-beige', _type: 'color', title: 'Beige', slug: {_type: 'slug', current: 'beige'}, hex: '#F5F0E1'},
]

const sizes = [
  {_id: 'size-xs', _type: 'size', title: 'Extra Small', code: 'XS', sortOrder: 1},
  {_id: 'size-s', _type: 'size', title: 'Small', code: 'S', sortOrder: 2},
  {_id: 'size-m', _type: 'size', title: 'Medium', code: 'M', sortOrder: 3},
  {_id: 'size-l', _type: 'size', title: 'Large', code: 'L', sortOrder: 4},
  {_id: 'size-xl', _type: 'size', title: 'Extra Large', code: 'XL', sortOrder: 5},
]

const materials = [
  {_id: 'material-cotton', _type: 'material', title: 'Cotton', slug: {_type: 'slug', current: 'cotton'}},
  {_id: 'material-wool', _type: 'material', title: 'Wool', slug: {_type: 'slug', current: 'wool'}},
  {_id: 'material-polyester', _type: 'material', title: 'Polyester', slug: {_type: 'slug', current: 'polyester'}},
  {_id: 'material-linen', _type: 'material', title: 'Linen', slug: {_type: 'slug', current: 'linen'}},
  {_id: 'material-cashmere', _type: 'material', title: 'Cashmere', slug: {_type: 'slug', current: 'cashmere'}},
]

// Helper to create a reference
const ref = (id) => ({_type: 'reference', _ref: id})

// Helper to create a keyed reference (for arrays)
const keyedRef = (id, key) => ({_type: 'reference', _ref: id, _key: key})

// Helper to create a variant
const variant = (key, colorId, sizeIds, available, sku) => ({
  _type: 'productVariant',
  _key: key,
  color: ref(colorId),
  sizes: sizeIds.map((sid, i) => keyedRef(sid, `${key}-size-${i}`)),
  available,
  sku,
})

// ── Products ────────────────────────────────────────────────────────────────

const products = [
  {
    _id: 'product-1',
    _type: 'product',
    title: 'Alpine Wool Crewneck Sweater',
    slug: {_type: 'slug', current: 'alpine-wool-crewneck-sweater'},
    description: 'A classic crewneck sweater crafted from premium merino wool. Perfect for layering on crisp mountain mornings or cool city evenings. Features ribbed cuffs and hem for a clean finish.',
    price: {_type: 'price', amount: 89, currency: 'USD'},
    brand: ref('brand-alpine-wear'),
    categories: [keyedRef('category-sweaters', 'cat-1')],
    materials: [keyedRef('material-wool', 'mat-1')],
    variants: [
      variant('v1', 'color-navy', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'AW-WCS-NVY'),
      variant('v2', 'color-gray', ['size-xs', 'size-s', 'size-m', 'size-l'], true, 'AW-WCS-GRY'),
      variant('v3', 'color-green', ['size-m', 'size-l'], true, 'AW-WCS-GRN'),
    ],
    seo: {_type: 'seo', metaTitle: 'Alpine Wool Crewneck Sweater | Alpine Wear', metaDescription: 'Premium merino wool crewneck sweater. Perfect for layering.'},
  },
  {
    _id: 'product-2',
    _type: 'product',
    title: 'Urban Thread Organic Cotton Tee',
    slug: {_type: 'slug', current: 'urban-thread-organic-cotton-tee'},
    description: 'An everyday essential made from 100% organic cotton. Relaxed fit with a soft hand feel. Pre-washed for zero shrinkage.',
    price: {_type: 'price', amount: 35, currency: 'USD'},
    brand: ref('brand-urban-thread'),
    categories: [keyedRef('category-tshirts', 'cat-1')],
    materials: [keyedRef('material-cotton', 'mat-1')],
    variants: [
      variant('v1', 'color-white', ['size-xs', 'size-s', 'size-m', 'size-l', 'size-xl'], true, 'UT-OCT-WHT'),
      variant('v2', 'color-black', ['size-xs', 'size-s', 'size-m', 'size-l', 'size-xl'], true, 'UT-OCT-BLK'),
      variant('v3', 'color-navy', ['size-s', 'size-m', 'size-l'], true, 'UT-OCT-NVY'),
    ],
    seo: {_type: 'seo', metaTitle: 'Organic Cotton Tee | Urban Thread', metaDescription: '100% organic cotton t-shirt with a relaxed fit.'},
  },
  {
    _id: 'product-3',
    _type: 'product',
    title: 'Summit Gear Waterproof Shell Jacket',
    slug: {_type: 'slug', current: 'summit-gear-waterproof-shell-jacket'},
    description: 'Engineered for the harshest conditions. 3-layer waterproof construction with sealed seams, adjustable hood, and pit zips for ventilation. Your go-to for alpine adventures.',
    price: {_type: 'price', amount: 249, currency: 'USD'},
    brand: ref('brand-summit-gear'),
    categories: [keyedRef('category-jackets', 'cat-1')],
    materials: [keyedRef('material-polyester', 'mat-1')],
    variants: [
      variant('v1', 'color-black', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'SG-WSJ-BLK'),
      variant('v2', 'color-red', ['size-m', 'size-l', 'size-xl'], true, 'SG-WSJ-RED'),
      variant('v3', 'color-blue', ['size-s', 'size-m', 'size-l'], true, 'SG-WSJ-BLU'),
    ],
    seo: {_type: 'seo', metaTitle: 'Waterproof Shell Jacket | Summit Gear', metaDescription: '3-layer waterproof shell jacket for alpine adventures.'},
  },
  {
    _id: 'product-4',
    _type: 'product',
    title: 'Meadow & Co Cashmere Wrap Dress',
    slug: {_type: 'slug', current: 'meadow-co-cashmere-wrap-dress'},
    description: 'Luxuriously soft cashmere wrap dress with a flattering silhouette. Features a self-tie belt and elegant drape. Perfect for transitional weather.',
    price: {_type: 'price', amount: 195, currency: 'USD'},
    brand: ref('brand-meadow-co'),
    categories: [keyedRef('category-dresses', 'cat-1')],
    materials: [keyedRef('material-cashmere', 'mat-1')],
    variants: [
      variant('v1', 'color-beige', ['size-xs', 'size-s', 'size-m', 'size-l'], true, 'MC-CWD-BGE'),
      variant('v2', 'color-black', ['size-s', 'size-m', 'size-l'], true, 'MC-CWD-BLK'),
    ],
    seo: {_type: 'seo', metaTitle: 'Cashmere Wrap Dress | Meadow & Co', metaDescription: 'Luxurious cashmere wrap dress with a flattering silhouette.'},
  },
  {
    _id: 'product-5',
    _type: 'product',
    title: 'Coastal Co Linen Drawstring Pants',
    slug: {_type: 'slug', current: 'coastal-co-linen-drawstring-pants'},
    description: 'Breezy linen pants with an elastic drawstring waist. Relaxed through the leg with a slight taper. Ideal for warm-weather days by the coast.',
    price: {_type: 'price', amount: 68, currency: 'USD'},
    brand: ref('brand-coastal-co'),
    categories: [keyedRef('category-pants', 'cat-1')],
    materials: [keyedRef('material-linen', 'mat-1')],
    variants: [
      variant('v1', 'color-white', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'CC-LDP-WHT'),
      variant('v2', 'color-beige', ['size-s', 'size-m', 'size-l'], true, 'CC-LDP-BGE'),
      variant('v3', 'color-navy', ['size-m', 'size-l', 'size-xl'], true, 'CC-LDP-NVY'),
    ],
    seo: {_type: 'seo', metaTitle: 'Linen Drawstring Pants | Coastal Co', metaDescription: 'Breezy linen pants perfect for warm-weather days.'},
  },
  {
    _id: 'product-6',
    _type: 'product',
    title: 'Alpine Wear Cashmere V-Neck Sweater',
    slug: {_type: 'slug', current: 'alpine-wear-cashmere-vneck-sweater'},
    description: 'Indulgent pure cashmere in a timeless V-neck silhouette. Lightweight yet warm, with a refined finish that elevates any outfit.',
    price: {_type: 'price', amount: 165, currency: 'USD', compareAtPrice: 220},
    brand: ref('brand-alpine-wear'),
    categories: [keyedRef('category-sweaters', 'cat-1')],
    materials: [keyedRef('material-cashmere', 'mat-1')],
    variants: [
      variant('v1', 'color-black', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'AW-CVS-BLK'),
      variant('v2', 'color-beige', ['size-xs', 'size-s', 'size-m', 'size-l'], true, 'AW-CVS-BGE'),
      variant('v3', 'color-navy', ['size-m', 'size-l'], false, 'AW-CVS-NVY'),
    ],
    seo: {_type: 'seo', metaTitle: 'Cashmere V-Neck Sweater | Alpine Wear', metaDescription: 'Pure cashmere V-neck sweater. On sale now.'},
  },
  {
    _id: 'product-7',
    _type: 'product',
    title: 'Urban Thread Recycled Polyester Bomber',
    slug: {_type: 'slug', current: 'urban-thread-recycled-polyester-bomber'},
    description: 'A modern bomber jacket made from 100% recycled polyester. Ribbed collar, cuffs, and hem. Zip front with interior pocket. Sustainability meets street style.',
    price: {_type: 'price', amount: 120, currency: 'USD'},
    brand: ref('brand-urban-thread'),
    categories: [keyedRef('category-jackets', 'cat-1')],
    materials: [keyedRef('material-polyester', 'mat-1')],
    variants: [
      variant('v1', 'color-black', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'UT-RPB-BLK'),
      variant('v2', 'color-green', ['size-m', 'size-l'], true, 'UT-RPB-GRN'),
      variant('v3', 'color-navy', ['size-s', 'size-m', 'size-l'], true, 'UT-RPB-NVY'),
    ],
    seo: {_type: 'seo', metaTitle: 'Recycled Polyester Bomber | Urban Thread', metaDescription: 'Sustainable bomber jacket from 100% recycled polyester.'},
  },
  {
    _id: 'product-8',
    _type: 'product',
    title: 'Coastal Co Cotton Henley Tee',
    slug: {_type: 'slug', current: 'coastal-co-cotton-henley-tee'},
    description: 'A laid-back henley with a three-button placket. Made from garment-dyed cotton for a lived-in feel from day one.',
    price: {_type: 'price', amount: 42, currency: 'USD'},
    brand: ref('brand-coastal-co'),
    categories: [keyedRef('category-tshirts', 'cat-1')],
    materials: [keyedRef('material-cotton', 'mat-1')],
    variants: [
      variant('v1', 'color-white', ['size-s', 'size-m', 'size-l'], true, 'CC-CHT-WHT'),
      variant('v2', 'color-blue', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'CC-CHT-BLU'),
      variant('v3', 'color-gray', ['size-m', 'size-l'], true, 'CC-CHT-GRY'),
    ],
    seo: {_type: 'seo', metaTitle: 'Cotton Henley Tee | Coastal Co', metaDescription: 'Garment-dyed cotton henley with a relaxed fit.'},
  },
  {
    _id: 'product-9',
    _type: 'product',
    title: 'Summit Gear Down Puffer Jacket',
    slug: {_type: 'slug', current: 'summit-gear-down-puffer-jacket'},
    description: 'Lightweight 700-fill down puffer with water-resistant shell. Packs into its own pocket for easy travel. Warmth without the bulk.',
    price: {_type: 'price', amount: 189, currency: 'USD', compareAtPrice: 240},
    brand: ref('brand-summit-gear'),
    categories: [keyedRef('category-jackets', 'cat-1')],
    materials: [keyedRef('material-polyester', 'mat-1')],
    variants: [
      variant('v1', 'color-black', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'SG-DPJ-BLK'),
      variant('v2', 'color-navy', ['size-m', 'size-l', 'size-xl'], true, 'SG-DPJ-NVY'),
      variant('v3', 'color-red', ['size-s', 'size-m'], false, 'SG-DPJ-RED'),
    ],
    seo: {_type: 'seo', metaTitle: 'Down Puffer Jacket | Summit Gear', metaDescription: '700-fill down puffer jacket. On sale now.'},
  },
  {
    _id: 'product-10',
    _type: 'product',
    title: 'Meadow & Co Wool Blend Midi Dress',
    slug: {_type: 'slug', current: 'meadow-co-wool-blend-midi-dress'},
    description: 'A sophisticated midi dress in a soft wool blend. Features a fitted bodice, A-line skirt, and hidden side pockets. Effortlessly elegant.',
    price: {_type: 'price', amount: 155, currency: 'USD'},
    brand: ref('brand-meadow-co'),
    categories: [keyedRef('category-dresses', 'cat-1')],
    materials: [keyedRef('material-wool', 'mat-1')],
    variants: [
      variant('v1', 'color-black', ['size-xs', 'size-s', 'size-m', 'size-l'], true, 'MC-WMD-BLK'),
      variant('v2', 'color-navy', ['size-s', 'size-m', 'size-l'], true, 'MC-WMD-NVY'),
      variant('v3', 'color-red', ['size-s', 'size-m'], true, 'MC-WMD-RED'),
    ],
    seo: {_type: 'seo', metaTitle: 'Wool Blend Midi Dress | Meadow & Co', metaDescription: 'Sophisticated wool blend midi dress with hidden pockets.'},
  },
  {
    _id: 'product-11',
    _type: 'product',
    title: 'Alpine Wear Merino Wool Beanie',
    slug: {_type: 'slug', current: 'alpine-wear-merino-wool-beanie'},
    description: 'A snug-fitting beanie knitted from soft merino wool. Ribbed construction for stretch and comfort. An essential cold-weather accessory.',
    price: {_type: 'price', amount: 32, currency: 'USD'},
    brand: ref('brand-alpine-wear'),
    categories: [keyedRef('category-accessories', 'cat-1')],
    materials: [keyedRef('material-wool', 'mat-1')],
    variants: [
      variant('v1', 'color-black', ['size-s', 'size-m', 'size-l'], true, 'AW-MWB-BLK'),
      variant('v2', 'color-gray', ['size-s', 'size-m', 'size-l'], true, 'AW-MWB-GRY'),
      variant('v3', 'color-red', ['size-s', 'size-m'], true, 'AW-MWB-RED'),
      variant('v4', 'color-navy', ['size-s', 'size-m', 'size-l'], true, 'AW-MWB-NVY'),
    ],
    seo: {_type: 'seo', metaTitle: 'Merino Wool Beanie | Alpine Wear', metaDescription: 'Soft merino wool beanie for cold-weather comfort.'},
  },
  {
    _id: 'product-12',
    _type: 'product',
    title: 'Urban Thread Slim Chino Pants',
    slug: {_type: 'slug', current: 'urban-thread-slim-chino-pants'},
    description: 'Modern slim-fit chinos in a stretch cotton twill. Clean front with a tailored leg. Versatile enough for the office or weekend.',
    price: {_type: 'price', amount: 78, currency: 'USD'},
    brand: ref('brand-urban-thread'),
    categories: [keyedRef('category-pants', 'cat-1')],
    materials: [keyedRef('material-cotton', 'mat-1')],
    variants: [
      variant('v1', 'color-navy', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'UT-SCP-NVY'),
      variant('v2', 'color-black', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'UT-SCP-BLK'),
      variant('v3', 'color-beige', ['size-m', 'size-l', 'size-xl'], true, 'UT-SCP-BGE'),
    ],
    seo: {_type: 'seo', metaTitle: 'Slim Chino Pants | Urban Thread', metaDescription: 'Modern slim-fit chinos in stretch cotton twill.'},
  },
  {
    _id: 'product-13',
    _type: 'product',
    title: 'Coastal Co Linen Camp Shirt',
    slug: {_type: 'slug', current: 'coastal-co-linen-camp-shirt'},
    description: 'A relaxed camp-collar shirt in breathable linen. Boxy fit with a straight hem designed to be worn untucked. Summer essential.',
    price: {_type: 'price', amount: 55, currency: 'USD'},
    brand: ref('brand-coastal-co'),
    categories: [keyedRef('category-tshirts', 'cat-1')],
    materials: [keyedRef('material-linen', 'mat-1')],
    variants: [
      variant('v1', 'color-white', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'CC-LCS-WHT'),
      variant('v2', 'color-blue', ['size-s', 'size-m', 'size-l'], true, 'CC-LCS-BLU'),
      variant('v3', 'color-beige', ['size-m', 'size-l'], true, 'CC-LCS-BGE'),
    ],
    seo: {_type: 'seo', metaTitle: 'Linen Camp Shirt | Coastal Co', metaDescription: 'Breathable linen camp-collar shirt for summer.'},
  },
  {
    _id: 'product-14',
    _type: 'product',
    title: 'Summit Gear Softshell Vest',
    slug: {_type: 'slug', current: 'summit-gear-softshell-vest'},
    description: 'A versatile softshell vest with wind-resistant front and stretchy back panel. Ideal as a mid-layer or standalone on mild days.',
    price: {_type: 'price', amount: 95, currency: 'USD'},
    brand: ref('brand-summit-gear'),
    categories: [keyedRef('category-jackets', 'cat-1')],
    materials: [keyedRef('material-polyester', 'mat-1')],
    variants: [
      variant('v1', 'color-black', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'SG-SSV-BLK'),
      variant('v2', 'color-gray', ['size-m', 'size-l', 'size-xl'], true, 'SG-SSV-GRY'),
    ],
    seo: {_type: 'seo', metaTitle: 'Softshell Vest | Summit Gear', metaDescription: 'Wind-resistant softshell vest for versatile layering.'},
  },
  {
    _id: 'product-15',
    _type: 'product',
    title: 'Meadow & Co Cotton Sundress',
    slug: {_type: 'slug', current: 'meadow-co-cotton-sundress'},
    description: 'A breezy cotton sundress with adjustable spaghetti straps and a tiered skirt. Lined bodice for comfort. Perfect for garden parties and summer outings.',
    price: {_type: 'price', amount: 88, currency: 'USD'},
    brand: ref('brand-meadow-co'),
    categories: [keyedRef('category-dresses', 'cat-1')],
    materials: [keyedRef('material-cotton', 'mat-1')],
    variants: [
      variant('v1', 'color-white', ['size-xs', 'size-s', 'size-m', 'size-l'], true, 'MC-CSD-WHT'),
      variant('v2', 'color-blue', ['size-s', 'size-m', 'size-l'], true, 'MC-CSD-BLU'),
      variant('v3', 'color-red', ['size-xs', 'size-s', 'size-m'], true, 'MC-CSD-RED'),
    ],
    seo: {_type: 'seo', metaTitle: 'Cotton Sundress | Meadow & Co', metaDescription: 'Breezy cotton sundress with tiered skirt.'},
  },
  {
    _id: 'product-16',
    _type: 'product',
    title: 'Alpine Wear Wool Scarf',
    slug: {_type: 'slug', current: 'alpine-wear-wool-scarf'},
    description: 'A generously sized wool scarf with fringed ends. Soft, warm, and versatile — wrap it, drape it, or tie it.',
    price: {_type: 'price', amount: 45, currency: 'USD', compareAtPrice: 60},
    brand: ref('brand-alpine-wear'),
    categories: [keyedRef('category-accessories', 'cat-1')],
    materials: [keyedRef('material-wool', 'mat-1')],
    variants: [
      variant('v1', 'color-gray', ['size-m'], true, 'AW-WS-GRY'),
      variant('v2', 'color-navy', ['size-m'], true, 'AW-WS-NVY'),
      variant('v3', 'color-red', ['size-m'], true, 'AW-WS-RED'),
      variant('v4', 'color-beige', ['size-m'], true, 'AW-WS-BGE'),
    ],
    seo: {_type: 'seo', metaTitle: 'Wool Scarf | Alpine Wear', metaDescription: 'Generously sized wool scarf. On sale now.'},
  },
  {
    _id: 'product-17',
    _type: 'product',
    title: 'Urban Thread Heavyweight Cotton Hoodie',
    slug: {_type: 'slug', current: 'urban-thread-heavyweight-cotton-hoodie'},
    description: 'A substantial 400gsm cotton hoodie with a kangaroo pocket and drawstring hood. Oversized fit for maximum comfort. Built to last.',
    price: {_type: 'price', amount: 85, currency: 'USD'},
    brand: ref('brand-urban-thread'),
    categories: [keyedRef('category-sweaters', 'cat-1')],
    materials: [keyedRef('material-cotton', 'mat-1')],
    variants: [
      variant('v1', 'color-black', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'UT-HCH-BLK'),
      variant('v2', 'color-gray', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'UT-HCH-GRY'),
      variant('v3', 'color-navy', ['size-m', 'size-l', 'size-xl'], true, 'UT-HCH-NVY'),
      variant('v4', 'color-green', ['size-m', 'size-l'], true, 'UT-HCH-GRN'),
    ],
    seo: {_type: 'seo', metaTitle: 'Heavyweight Cotton Hoodie | Urban Thread', metaDescription: '400gsm cotton hoodie with oversized fit.'},
  },
  {
    _id: 'product-18',
    _type: 'product',
    title: 'Coastal Co Stretch Cotton Shorts',
    slug: {_type: 'slug', current: 'coastal-co-stretch-cotton-shorts'},
    description: 'Comfortable stretch cotton shorts with a 7-inch inseam. Flat front with side and back pockets. A warm-weather wardrobe staple.',
    price: {_type: 'price', amount: 48, currency: 'USD'},
    brand: ref('brand-coastal-co'),
    categories: [keyedRef('category-pants', 'cat-1')],
    materials: [keyedRef('material-cotton', 'mat-1')],
    variants: [
      variant('v1', 'color-navy', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'CC-SCS-NVY'),
      variant('v2', 'color-beige', ['size-s', 'size-m', 'size-l'], true, 'CC-SCS-BGE'),
      variant('v3', 'color-blue', ['size-m', 'size-l', 'size-xl'], true, 'CC-SCS-BLU'),
    ],
    seo: {_type: 'seo', metaTitle: 'Stretch Cotton Shorts | Coastal Co', metaDescription: 'Comfortable stretch cotton shorts for warm weather.'},
  },
  {
    _id: 'product-19',
    _type: 'product',
    title: 'Meadow & Co Cashmere Cardigan',
    slug: {_type: 'slug', current: 'meadow-co-cashmere-cardigan'},
    description: 'A luxurious open-front cashmere cardigan with dropped shoulders and patch pockets. Effortlessly chic for layering over dresses or tees.',
    price: {_type: 'price', amount: 210, currency: 'USD'},
    brand: ref('brand-meadow-co'),
    categories: [keyedRef('category-sweaters', 'cat-1')],
    materials: [keyedRef('material-cashmere', 'mat-1')],
    variants: [
      variant('v1', 'color-beige', ['size-xs', 'size-s', 'size-m', 'size-l'], true, 'MC-CC-BGE'),
      variant('v2', 'color-gray', ['size-s', 'size-m', 'size-l'], true, 'MC-CC-GRY'),
      variant('v3', 'color-black', ['size-s', 'size-m'], true, 'MC-CC-BLK'),
    ],
    seo: {_type: 'seo', metaTitle: 'Cashmere Cardigan | Meadow & Co', metaDescription: 'Luxurious open-front cashmere cardigan.'},
  },
  {
    _id: 'product-20',
    _type: 'product',
    title: 'Summit Gear Fleece-Lined Joggers',
    slug: {_type: 'slug', current: 'summit-gear-fleece-lined-joggers'},
    description: 'Technical joggers with a soft fleece lining for cold-weather training. Tapered leg with zippered pockets and reflective details.',
    price: {_type: 'price', amount: 72, currency: 'USD', compareAtPrice: 90},
    brand: ref('brand-summit-gear'),
    categories: [keyedRef('category-pants', 'cat-1')],
    materials: [keyedRef('material-polyester', 'mat-1')],
    variants: [
      variant('v1', 'color-black', ['size-s', 'size-m', 'size-l', 'size-xl'], true, 'SG-FLJ-BLK'),
      variant('v2', 'color-gray', ['size-s', 'size-m', 'size-l'], true, 'SG-FLJ-GRY'),
      variant('v3', 'color-navy', ['size-m', 'size-l', 'size-xl'], true, 'SG-FLJ-NVY'),
    ],
    seo: {_type: 'seo', metaTitle: 'Fleece-Lined Joggers | Summit Gear', metaDescription: 'Fleece-lined joggers for cold-weather training. On sale now.'},
  },
]

// ── Agent Config ────────────────────────────────────────────────────────────

const agentConfig = {
  _id: 'agent-config-default',
  _type: 'agent.config',
  name: 'Default Shopping Assistant',
  slug: {_type: 'slug', current: 'default'},
  systemPrompt: `You are a helpful shopping assistant for a clothing store. You have access to the product catalog through structured content tools.

When a customer asks about products:
1. First use initial_context to understand the available content types and schema
2. Use groq_query to find products matching their criteria with precise filters
3. Use schema_explorer if you need to understand a specific type's fields

Always provide specific product details (name, price, available sizes/colors) when answering.
Be conversational and helpful. If you can't find exactly what they're looking for, suggest alternatives.
Format prices with the currency symbol. Mention if items are on sale (have a compareAtPrice).`,
}

// ── Import ──────────────────────────────────────────────────────────────────

async function importData() {
  console.log('\n🚀 Starting data import...\n')

  // Batch 1: Reference data
  console.log('📦 Importing brands, categories, colors, sizes, materials...')
  let tx = client.transaction()
  for (const doc of [...brands, ...categories, ...colors, ...sizes, ...materials]) {
    tx = tx.createOrReplace(doc)
  }
  await tx.commit()
  console.log('   ✅ Reference data imported')

  // Batch 2: Products (in batches of 5 to avoid transaction limits)
  console.log('📦 Importing products...')
  for (let i = 0; i < products.length; i += 5) {
    let tx = client.transaction()
    const batch = products.slice(i, i + 5)
    for (const doc of batch) {
      tx = tx.createOrReplace(doc)
    }
    await tx.commit()
    console.log(`   ✅ Products ${i + 1}-${Math.min(i + 5, products.length)} imported`)
  }

  // Batch 3: Agent config
  console.log('📦 Importing agent config...')
  let tx3 = client.transaction()
  tx3 = tx3.createOrReplace(agentConfig)
  await tx3.commit()
  console.log('   ✅ Agent config imported')

  console.log('\n✨ All data imported successfully!')
  console.log(`   • ${brands.length} brands`)
  console.log(`   • ${categories.length} categories`)
  console.log(`   • ${colors.length} colors`)
  console.log(`   • ${sizes.length} sizes`)
  console.log(`   • ${materials.length} materials`)
  console.log(`   • ${products.length} products`)
  console.log(`   • 1 agent config\n`)
}

importData().catch((err) => {
  console.error('❌ Import failed:', err.message)
  process.exit(1)
})
