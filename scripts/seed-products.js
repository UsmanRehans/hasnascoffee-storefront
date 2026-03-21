const https = require('https');

const STORE = 'y0ngah-e1.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

if (!TOKEN) {
  console.error('Missing SHOPIFY_ADMIN_TOKEN');
  process.exit(1);
}

const products = [
  // Menu drinks
  {
    title: 'Ethiopian Coffee Ceremony',
    body_html: 'The full three-round ceremony — Abol, Tona & Baraka. Beans roasted tableside, brewed in a clay jebena. Served with popcorn or kollo.',
    product_type: 'Drink',
    tags: 'signature, ceremony, traditional',
    variants: [{ price: '18.00', requires_shipping: false }],
  },
  {
    title: 'Jebena Buna',
    body_html: 'Traditional black coffee brewed in a clay jebena, served in small handle-less cups. Pure, clean and deeply aromatic.',
    product_type: 'Drink',
    tags: 'traditional',
    variants: [{ price: '6.00', requires_shipping: false }],
  },
  {
    title: 'Buna Be Wetet',
    body_html: 'Coffee prepared with butter and salt — a beloved tradition from the Oromia highlands. Rich, savory and nourishing.',
    product_type: 'Drink',
    tags: 'traditional',
    variants: [{ price: '5.50', requires_shipping: false }],
  },
  {
    title: 'Spiced Coffee',
    body_html: 'Jebena coffee infused with cardamom, cinnamon and cloves. Aromatic and warming with layered spice notes.',
    product_type: 'Drink',
    tags: 'spiced',
    variants: [{ price: '6.00', requires_shipping: false }],
  },
  {
    title: 'Yirgacheffe Espresso',
    body_html: 'Single-origin double espresso. Bright and floral with bergamot, jasmine and lemon. Clean, no bitterness.',
    product_type: 'Drink',
    tags: 'single-origin, espresso',
    variants: [{ price: '4.50', requires_shipping: false }],
  },
  {
    title: 'Harar Macchiato',
    body_html: 'Bold Harar espresso with dry, wine-like character topped with a small cloud of steamed milk. Intense and complex.',
    product_type: 'Drink',
    tags: 'espresso, macchiato',
    variants: [{ price: '5.00', requires_shipping: false }],
  },
  {
    title: 'Sidama Latte',
    body_html: 'Sidama espresso with velvety steamed milk. Notes of dark chocolate and red berry. Oat, almond or whole milk.',
    product_type: 'Drink',
    tags: 'latte',
    variants: [
      { title: 'Oat Milk',   price: '6.00', requires_shipping: false },
      { title: 'Almond Milk', price: '6.00', requires_shipping: false },
      { title: 'Whole Milk',  price: '6.00', requires_shipping: false },
    ],
  },
  {
    title: 'Honey Cardamom Latte',
    body_html: 'Yirgacheffe espresso, oat milk, Ethiopian wildflower honey and fresh cardamom. Sweet, aromatic and comforting.',
    product_type: 'Drink',
    tags: 'house-favourite, latte',
    variants: [{ price: '6.50', requires_shipping: false }],
  },
  {
    title: 'Cold Brew Harar',
    body_html: 'Harar beans steeped cold for 18 hours. Smoky, fruity and sweet. Notes of dried blueberry and dark chocolate.',
    product_type: 'Drink',
    tags: 'cold-brew, iced',
    variants: [{ price: '6.00', requires_shipping: false }],
  },
  {
    title: 'Iced Honey Buna',
    body_html: 'Chilled double espresso over ice with wildflower honey and whole milk. Refreshing and rich.',
    product_type: 'Drink',
    tags: 'seasonal, iced',
    variants: [{ price: '6.50', requires_shipping: false }],
  },
  {
    title: 'Tej — Honey Mead Tea',
    body_html: 'Non-alcoholic honey mead brewed with gesho hops and warm spices. Warm or chilled.',
    product_type: 'Drink',
    tags: 'non-caffeinated, tea',
    variants: [{ price: '5.50', requires_shipping: false }],
  },
  {
    title: 'Kuti — Ginger Tea',
    body_html: 'Bold fresh ginger with honey and lemon. A traditional Ethiopian digestive remedy that warms from the inside out.',
    product_type: 'Drink',
    tags: 'non-caffeinated, tea',
    variants: [{ price: '4.50', requires_shipping: false }],
  },
  // Best sellers (packaged)
  {
    title: 'Espresso Blend',
    body_html: 'Bold, rich, and packed with flavor. Perfect for those who crave an intense coffee experience.',
    product_type: 'Coffee Beans',
    tags: 'best-seller, beans, espresso',
    variants: [{ title: '12 oz', price: '15.99', requires_shipping: true }],
  },
  {
    title: 'House Blend',
    body_html: 'A smooth and balanced blend ideal for every occasion. Light, medium roast with notes of caramel and chocolate.',
    product_type: 'Coffee Beans',
    tags: 'best-seller, beans',
    variants: [{ title: '12 oz', price: '12.99', requires_shipping: true }],
  },
  {
    title: 'Cold Brew Concentrate',
    body_html: 'Refreshing, smooth, and ready-to-drink. Our cold brew concentrate is perfect for hot days or a quick pick-me-up.',
    product_type: 'Cold Brew',
    tags: 'best-seller, cold-brew',
    variants: [{ title: '16 oz', price: '18.99', requires_shipping: true }],
  },
];

function createProduct(product) {
  const body = JSON.stringify({ product });
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: STORE,
        path: '/admin/api/2024-01/products.json',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': TOKEN,
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          const json = JSON.parse(data);
          if (res.statusCode === 201) resolve(json.product);
          else reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log(`Creating ${products.length} products...\n`);
  for (const p of products) {
    try {
      const created = await createProduct(p);
      console.log(`✓ ${created.title} (id: ${created.id})`);
      await sleep(500);
    } catch (err) {
      console.error(`✗ ${p.title}: ${err.message}`);
    }
  }
  console.log('\nDone.');
}

main();
