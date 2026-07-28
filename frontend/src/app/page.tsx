"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Mock product data                                                 */
/* ------------------------------------------------------------------ */
const PRODUCTS = [
  {
    id: 1,
    name: "Whey Protein Gold",
    brand: "OptimumNutrition",
    category: "Proteínas",
    price: 32500,
    originalPrice: 38000,
    stock: 24,
    image: "/products/whey-protein.png",
    badge: "Más Vendido",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  {
    id: 2,
    name: "Creatina Monohidratada",
    brand: "ENA",
    category: "Creatinas",
    price: 18900,
    originalPrice: null,
    stock: 45,
    image: "/products/creatine.png",
    badge: null,
    badgeColor: "",
  },
  {
    id: 3,
    name: "Pre-Workout Ignite",
    brand: "Star Nutrition",
    category: "Pre-Entreno",
    price: 27600,
    originalPrice: 31000,
    stock: 12,
    image: "/products/pre-workout.png",
    badge: "Oferta",
    badgeColor: "bg-red-100 text-red-700",
  },
  {
    id: 4,
    name: "BCAA 5000",
    brand: "Gentech",
    category: "Aminoácidos",
    price: 15400,
    originalPrice: null,
    stock: 30,
    image: "/products/bcaa.png",
    badge: "Nuevo",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 5,
    name: "L-Glutamina Pura",
    brand: "Xtrenght",
    category: "Aminoácidos",
    price: 14200,
    originalPrice: 16500,
    stock: 18,
    image: "/products/glutamine.png",
    badge: null,
    badgeColor: "",
  },
  {
    id: 6,
    name: "Mass Gainer 3kg",
    brand: "True Made",
    category: "Ganadores de Peso",
    price: 42800,
    originalPrice: null,
    stock: 8,
    image: "/products/mass-gainer.png",
    badge: "Últimas unidades",
    badgeColor: "bg-orange-100 text-orange-700",
  },
];

const CATEGORIES = ["Todos", "Proteínas", "Creatinas", "Aminoácidos", "Pre-Entreno", "Ganadores de Peso"];

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  /* ── Chat state ─────────────────────────────────────────────────── */
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    {
      role: "agent",
      text: "¡Hola! 👋 Soy tu asesor experto en suplementos. Puedo ayudarte a encontrar el producto ideal para tus objetivos. ¿Qué estás buscando hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ── Store state ────────────────────────────────────────────────── */
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cartCount, setCartCount] = useState(0);

  // Hardcoded user id for MVP
  const userId = 1;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ── Chat handler ───────────────────────────────────────────────── */
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${apiUrl}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: userMessage }),
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "agent", text: data.message }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "Lo siento, ha ocurrido un error. Por favor intenta de nuevo." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Add to cart (visual only for MVP) ──────────────────────────── */
  const handleAddToCart = (productName: string) => {
    setCartCount((prev) => prev + 1);
    // Also tell the chat
    setMessages((prev) => [
      ...prev,
      { role: "user", text: `Agrega ${productName} al carrito` },
    ]);
    // Trigger the agent
    (async () => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${apiUrl}/chat/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, message: `Agrega ${productName} al carrito` }),
        });
        if (!response.ok) throw new Error("Error");
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "agent", text: data.message }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "agent", text: `¡Listo! Agregué ${productName} a tu carrito. 🛒` },
        ]);
      } finally {
        setIsLoading(false);
      }
    })();
    // Open chat if closed
    if (!isChatOpen) setIsChatOpen(true);
  };

  /* ── Filter products ────────────────────────────────────────────── */
  const filteredProducts =
    selectedCategory === "Todos"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ════════════════════════════════════════════════════════════ */}
      {/*  LEFT — STOREFRONT                                         */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isChatOpen ? "" : ""}`}>
        {/* ── Navbar ──────────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-lg border-b border-border px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Supple<span className="text-primary">Mart</span>
              </span>
            </div>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
              <a href="#" className="hover:text-foreground transition-colors">Inicio</a>
              <a href="#productos" className="hover:text-foreground transition-colors">Productos</a>
              <a href="#" className="hover:text-foreground transition-colors">Ofertas</a>
              <a href="#" className="hover:text-foreground transition-colors">Contacto</a>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <button
                id="cart-button"
                className="relative p-2 rounded-xl hover:bg-surface-hover transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Chat toggle */}
              <button
                id="chat-toggle"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isChatOpen
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-gradient-to-r from-gradient-start to-gradient-end text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105"
                }`}
              >
                <span className="relative flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                </span>
                <span className="hidden sm:inline">Asistente Virtual</span>
              </button>
            </div>
          </div>
        </header>

        {/* ── Main content (scrollable) ──────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          {/* Hero Banner */}
          <section className="relative overflow-hidden bg-gradient-to-br from-gradient-start to-gradient-end text-white">
            <div className="absolute inset-0 hero-shimmer pointer-events-none" />
            <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
              <div className="max-w-2xl">
                <span className="badge bg-white/20 text-white mb-4">🔥 Ofertas de Temporada</span>
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                  Potenciá tu rendimiento con los mejores suplementos
                </h1>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  Contá con nuestro <strong>Agente IA</strong> para asesorarte y encontrar
                  los productos ideales según tus objetivos deportivos.
                </p>
                <div className="flex gap-3">
                  <a
                    href="#productos"
                    className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
                  >
                    Ver Productos
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="inline-flex items-center gap-2 bg-white/15 backdrop-blur text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/25 transition-colors border border-white/20"
                  >
                    💬 Hablar con el Agente
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Products Section */}
          <section id="productos" className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Nuestros Productos</h2>
                <p className="text-muted text-sm mt-1">Encontrá lo que necesitás para alcanzar tus metas</p>
              </div>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "bg-surface text-muted hover:text-foreground hover:bg-surface-hover border border-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="product-card bg-surface rounded-2xl border border-border overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Image */}
                  <div className="relative bg-gradient-to-b from-slate-50 to-white p-6 flex items-center justify-center h-56">
                    {product.badge && (
                      <span className={`badge absolute top-3 left-3 ${product.badgeColor}`}>
                        {product.badge}
                      </span>
                    )}
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={180}
                      height={180}
                      className="object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {product.brand}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{product.name}</h3>
                    <p className="text-xs text-muted mb-3">{product.category} · Stock: {product.stock} unid.</p>

                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-2xl font-extrabold text-foreground">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      id={`add-to-cart-${product.id}`}
                      onClick={() => handleAddToCart(product.name)}
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border bg-surface px-6 py-8 mt-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center text-white font-bold text-sm">S</div>
                <span className="font-semibold text-foreground">SuppleMart</span>
              </div>
              <p>© 2026 SuppleMart. Todos los derechos reservados.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-foreground transition-colors">Términos</a>
                <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*  RIGHT — CHAT SIDEBAR                                      */}
      {/* ════════════════════════════════════════════════════════════ */}
      <aside
        className={`chat-panel flex flex-col border-l border-chat-border bg-chat-bg transition-all duration-300 ease-in-out ${
          isChatOpen ? "w-[380px] min-w-[380px]" : "w-0 min-w-0 overflow-hidden"
        }`}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-chat-border bg-chat-surface/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-chat-bg" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-chat-text">Asistente IA</h2>
              <p className="text-xs text-chat-muted">En línea</p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="p-1.5 rounded-lg hover:bg-chat-surface text-chat-muted hover:text-chat-text transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-2xl rounded-br-md"
                    : "bg-chat-surface text-chat-text rounded-2xl rounded-bl-md border border-chat-border"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-chat-surface border border-chat-border px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="px-4 py-3 border-t border-chat-border bg-chat-surface/50">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-chat-surface text-chat-text border border-chat-border rounded-xl px-4 py-2.5 text-sm placeholder-chat-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              disabled={isLoading}
            />
            <button
              id="chat-send"
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary-hover text-white p-2.5 rounded-xl disabled:opacity-40 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
