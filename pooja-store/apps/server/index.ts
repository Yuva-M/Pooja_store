import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/bun'
import { handle } from 'hono/vercel'

const app = new Hono()

app.use('/*', cors())
app.use('/static/*', serveStatic({ root: './public', rewriteRequestPath: (path) => path.replace(/^\/static/, '') }))

const products = [
    {
        id: '1',
        name: 'Brass Diya',
        description: 'Handcrafted traditional brass diya for your daily pooja.',
        price: 15.99,
        image: 'http://localhost:3001/static/diya.png',
        category: 'Diya'
    },
    {
        id: '2',
        name: 'Incense Sticks (Agarbatti)',
        description: 'Fragrant sandalwood incense sticks for a peaceful atmosphere.',
        price: 5.49,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=400',
        category: 'Incense'
    },
    {
        id: '3',
        name: 'Pooja Thali Set',
        description: 'Complete stainless steel pooja thali with all essentials.',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=400',
        category: 'Thali'
    },
    {
        id: '4',
        name: 'Ganesh Idol',
        description: 'Beautifully carved marble Ganesh idol for your home altar.',
        price: 45.00,
        image: 'http://localhost:3001/static/ganesh.png',
        category: 'Idols'
    }
]

app.get('/api/products', (c) => {
    return c.json(products)
})

app.get('/api/products/:id', (c) => {
    const id = c.req.param('id')
    const product = products.find(p => p.id === id)
    if (product) {
        return c.json(product)
    }
    return c.json({ message: 'Product not found' }, 404)
})

app.post('/api/checkout', async (c) => {
    const body = await c.req.json()
    console.log('Checkout received:', body)
    return c.json({ message: 'Order placed successfully!', orderId: Math.random().toString(36).substr(2, 9) })
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)

export default {
    port: 3001,
    fetch: app.fetch,
}
