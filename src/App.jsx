import { useEffect, useMemo, useState } from 'react'

const currency = 'RWF'
const products = [
  { id: 1, name: 'Premium Hoodie', category: 'Fashion', price: 25000, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80', description: 'Comfortable premium hoodie for everyday wear.' },
  { id: 2, name: 'Smart Watch', category: 'Electronics', price: 95000, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80', description: 'Track fitness, calls, and notifications.' },
  { id: 3, name: 'Luxury Perfume', category: 'Beauty', price: 32000, image: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=80', description: 'Long-lasting fragrance with a premium finish.' },
  { id: 4, name: 'Modern Lamp', category: 'Home', price: 42000, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', description: 'Elegant lamp for peaceful home ambiance.' },
  { id: 5, name: 'Travel Backpack', category: 'Accessories', price: 37000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', description: 'Durable and stylish backpack for daily travel.' },
  { id: 6, name: 'Wireless Earbuds', category: 'Electronics', price: 60000, image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=80', description: 'Clear sound, deep bass, and compact design.' },
  { id: 7, name: 'Cotton T-Shirt', category: 'Fashion', price: 18000, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', description: 'Soft, breathable, and perfect for everyday use.' },
  { id: 8, name: 'Ceramic Mug Set', category: 'Home', price: 24000, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80', description: 'Premium ceramic mugs for relaxing breaks.' },
]
const categories = ['All products', 'Fashion', 'Electronics', 'Beauty', 'Home', 'Accessories']
const readStorage = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }
const formatMoney = (value) => `${new Intl.NumberFormat('en-US').format(value)} ${currency}`

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All products')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState(() => readStorage('abitijelise_cart', []))
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' })
  const [currentUser, setCurrentUser] = useState(() => readStorage('abitijelise_current_user', null))
  const [checkoutPayment, setCheckoutPayment] = useState('MTN Mobile Money')
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  useEffect(() => localStorage.setItem('abitijelise_cart', JSON.stringify(cart)), [cart])
  useEffect(() => { if (currentUser) localStorage.setItem('abitijelise_current_user', JSON.stringify(currentUser)); else localStorage.removeItem('abitijelise_current_user') }, [currentUser])
  const filteredProducts = useMemo(() => products.filter((item) => { const matchesCategory = activeCategory === 'All products' || item.category === activeCategory; const query = search.toLowerCase(); return matchesCategory && (item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)) }), [activeCategory, search])
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = cart.length ? 2500 : 0
  const total = subtotal + shipping
  const addToCart = (product) => setCart((prev) => { const existing = prev.find((item) => item.id === product.id); return existing ? prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...prev, { ...product, quantity: 1 }] })
  const updateQuantity = (id, change) => setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item).filter((item) => item.quantity > 0))
  const handleAuthInput = (event) => setAuthForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  const handleRegister = (event) => {
    event.preventDefault()
    const users = readStorage('abitijelise_users', [])
    if (users.some((user) => user.email.toLowerCase() === authForm.email.toLowerCase())) { alert('This email already exists. Please login instead.'); return }
    const newUser = { name: authForm.name, email: authForm.email, password: authForm.password }
    localStorage.setItem('abitijelise_users', JSON.stringify([...users, newUser]))
    setCurrentUser({ name: newUser.name, email: newUser.email }); setAuthForm({ name: '', email: '', password: '' }); setIsAuthOpen(false)
    alert('Demo registration successful. This account is stored only in this browser.')
  }
  const handleLogin = (event) => {
    event.preventDefault()
    const users = readStorage('abitijelise_users', [])
    const foundUser = users.find((user) => user.email.toLowerCase() === authForm.email.toLowerCase() && user.password === authForm.password)
    if (!foundUser) { alert('Invalid email or password.'); return }
    setCurrentUser({ name: foundUser.name, email: foundUser.email }); setAuthForm({ name: '', email: '', password: '' }); setIsAuthOpen(false); alert('Logged in on this device.')
  }
  const handleCheckout = () => {
    if (!currentUser) { alert('Please register or log in before checkout.'); setIsAuthOpen(true); return }
    if (!cart.length) { alert('Your cart is empty.'); return }
    const message = encodeURIComponent(`Hello ABITIJELISE, I want to order:\n\n${cart.map((item) => `- ${item.name} x${item.quantity} = ${formatMoney(item.price * item.quantity)}`).join('\n')}\n\nTotal: ${formatMoney(total)}\nPreferred payment: ${checkoutPayment}\nCustomer: ${currentUser.name}\nEmail: ${currentUser.email}`)
    window.open(`https://wa.me/250796365450?text=${message}`, '_blank', 'noopener,noreferrer'); setCart([])
  }
  return <div className="app-shell">
    <header className="topbar"><a className="brand-wrap" href="#top" aria-label="ABITIJELISE home"><div className="brand-icon">A</div><div><div className="brand-name">ABITIJELISE</div><div className="tagline">Smart shopping in Rwanda</div></div></a><nav className="main-nav"><a href="#shop">Shop</a><a href="#featured">Featured</a><a href="#contact">Contact</a></nav><div className="header-actions"><a className="cart-btn" href="#cart">Cart ({cartCount})</a>{currentUser ? <div className="user-pill"><span>{currentUser.name}</span><button type="button" onClick={() => setCurrentUser(null)}>Logout</button></div> : <button className="primary-btn" type="button" onClick={() => setIsAuthOpen(true)}>Login / Register</button>}</div></header>
    <section id="top" className="hero"><div className="hero-copy"><p className="eyebrow">RWF • WhatsApp only</p><h1>Shop smarter with ABITIJELISE.</h1><p>Discover quality home, beauty, electronics, and fashion essentials at affordable prices in Rwanda.</p><div className="hero-actions"><a className="primary-btn" href="#shop">Shop now</a><a className="secondary-btn" href="https://wa.me/250796365450?text=Hello%20ABITIJELISE%2C%20I%20need%20help%20with%20my%20order." target="_blank" rel="noreferrer">Talk on WhatsApp</a></div><div className="mini-stats"><div><strong>All</strong><span>Products</span></div><div><strong>WhatsApp</strong><span>Order support</span></div><div><strong>RWF</strong><span>Local pricing</span></div></div></div><div className="hero-card"><div className="mini-panel"><span>Welcome to</span><strong>ABITIJELISE</strong></div><div className="card-image" /></div></section>
    <section id="shop" className="shop-section"><div className="section-header"><div><p className="eyebrow">Our store</p><h2>All products</h2></div><div className="search-box"><input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." aria-label="Search products" /></div></div><div className="category-bar">{categories.map((item) => <button key={item} type="button" className={item === activeCategory ? 'chip active' : 'chip'} onClick={() => setActiveCategory(item)}>{item}</button>)}</div><div className="content-grid"><div className="product-grid">{filteredProducts.map((product) => <article key={product.id} className="product-card"><div className="product-image" style={{ backgroundImage: `url(${product.image})` }} role="img" aria-label={product.name} /><div className="product-body"><span className="product-category">{product.category}</span><h3>{product.name}</h3><p>{product.description}</p><div className="product-meta"><strong>{formatMoney(product.price)}</strong><button type="button" onClick={() => addToCart(product)}>Add to cart</button></div></div></article>)}{filteredProducts.length === 0 && <p>No products match your search.</p>}</div><aside id="cart" className="cart-panel"><h3>Your cart</h3>{cart.length === 0 ? <div className="empty-cart"><p>Your cart is empty.</p></div> : <>{cart.map((item) => <div key={item.id} className="cart-item"><div><strong>{item.name}</strong><p>{formatMoney(item.price)}</p></div><div className="quantity-box"><button type="button" aria-label={`Remove one ${item.name}`} onClick={() => updateQuantity(item.id, -1)}>-</button><span>{item.quantity}</span><button type="button" aria-label={`Add one ${item.name}`} onClick={() => updateQuantity(item.id, 1)}>+</button></div></div>)}<div className="summary"><div><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div><div><span>Delivery estimate</span><strong>{formatMoney(shipping)}</strong></div><div className="grand-total"><span>Total</span><strong>{formatMoney(total)}</strong></div></div><fieldset className="payment-options"><legend>Preferred payment (confirm by WhatsApp)</legend><label><input type="radio" name="payment" checked={checkoutPayment === 'MTN Mobile Money'} onChange={() => setCheckoutPayment('MTN Mobile Money')} />MTN Mobile Money</label><label><input type="radio" name="payment" checked={checkoutPayment === 'Tigo Cash'} onChange={() => setCheckoutPayment('Tigo Cash')} />Tigo Cash</label></fieldset><p className="demo-note">Payments are not processed on this demo site. Your selection is included in your WhatsApp order message.</p><button type="button" className="primary-btn full" onClick={handleCheckout}>Send order via WhatsApp</button></>}</aside></div></section>
    <section id="featured" className="featured"><p className="eyebrow">Why choose us</p><h2>Shopping made simple</h2><div className="features"><div className="feature"><span>01</span><h3>RWF pricing</h3><p>Product prices are displayed in Rwandan francs.</p></div><div className="feature"><span>02</span><h3>WhatsApp orders</h3><p>Send your cart and preferred payment method directly to WhatsApp.</p></div><div className="feature"><span>03</span><h3>Easy browsing</h3><p>Browse categories, search products, and manage your cart.</p></div></div></section>
    <footer id="contact" className="footer"><div><div className="brand-name footer-brand">ABITIJELISE</div><p>Contact preference: WhatsApp only</p></div><div className="contact-box"><a href="https://wa.me/250796365450" target="_blank" rel="noreferrer">WhatsApp: +250 796 365 450</a><a href="https://www.instagram.com/abitijeelise" target="_blank" rel="noreferrer">Instagram: @abitijeelise</a><a href="https://www.facebook.com/NIELYSE" target="_blank" rel="noreferrer">Facebook: NI ELYSE</a></div></footer>
    {isAuthOpen && <div className="modal-overlay" onClick={() => setIsAuthOpen(false)}><div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onClick={(e) => e.stopPropagation()}><div className="auth-header"><h3 id="auth-title">{authMode === 'login' ? 'Login' : 'Register'}</h3><button type="button" aria-label="Close" onClick={() => setIsAuthOpen(false)}>×</button></div><p className="demo-note">Demo account only: credentials are stored in this browser, not securely on a server. Do not use a real password.</p><div className="mode-switch"><button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Login</button><button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>Register</button></div><form onSubmit={authMode === 'login' ? handleLogin : handleRegister}>{authMode === 'register' && <input type="text" name="name" placeholder="Full name" value={authForm.name} onChange={handleAuthInput} required />}<input type="email" name="email" placeholder="Email address" value={authForm.email} onChange={handleAuthInput} required /><input type="password" name="password" placeholder="Demo password" value={authForm.password} onChange={handleAuthInput} required /><button type="submit" className="primary-btn full">{authMode === 'login' ? 'Login' : 'Create demo account'}</button></form></div></div>}
  </div>
}
