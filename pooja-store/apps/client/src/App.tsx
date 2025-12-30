import React, { useState, useEffect } from 'react'
import { ShoppingCart, X, Plus, Minus, ShoppingBag } from 'lucide-react'

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    fetch(`${apiUrl}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching products:', err)
        setLoading(false)
      })
  }, [])

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, total })
      })
      const data = await res.json()
      alert(data.message + '\nOrder ID: ' + data.orderId)
      setCart([])
      setIsCartOpen(false)
    } catch (err) {
      alert('Checkout failed. Please try again.')
    }
  }

  return (
    <div className="app">
      <header>
        <div className="container nav-content">
          <div className="logo">
            <ShoppingBag size={28} />
            <span>Divine Pooja Store</span>
          </div>
          <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={24} />
            {cart.length > 0 && <span className="cart-count">{cart.reduce((s, i) => s + i.quantity, 0)}</span>}
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <h1>Bring Divinity Home</h1>
          <p>Handpicked premium pooja essentials for your sacred space.</p>
        </div>
      </section>

      <main className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Loading products...</div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>{product.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <button className="add-to-cart" onClick={() => addToCart(product)} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button className="cart-btn" onClick={() => setIsCartOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>Your cart is empty.</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <h4 className="product-name" style={{ fontSize: '1rem' }}>{item.name}</h4>
                      <p className="product-price" style={{ fontSize: '1rem' }}>${item.price.toFixed(2)}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button onClick={() => updateQuantity(item.id, -1)} style={{ background: '#eee', border: 'none', borderRadius: '4px', padding: '2px' }}><Minus size={16} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} style={{ background: '#eee', border: 'none', borderRadius: '4px', padding: '2px' }}><Plus size={16} /></button>
                        <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: 'auto', color: 'red', background: 'none', border: 'none', fontSize: '0.8rem' }}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Checkout Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer style={{ background: '#2d2d2d', color: 'white', padding: '3rem 0', marginTop: '4rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="logo" style={{ color: 'white', justifyContent: 'center', marginBottom: '1rem' }}>
            <ShoppingBag size={24} />
            <span>Divine Pooja Store</span>
          </div>
          <p style={{ opacity: 0.7 }}>&copy; 2025 Divine Pooja Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
