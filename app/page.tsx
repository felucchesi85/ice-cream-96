import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Clock, Truck } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

export default function HomePage() {
  const featuredPromotions = [
    {
      id: 1,
      title: "Combo Verano",
      description: "2 Palitos + 1 Tacita por solo $1200",
      originalPrice: 1500,
      promoPrice: 1200,
      image: "/ice-cream-summer-combo.png",
      badge: "20% OFF",
    },
    {
      id: 2,
      title: "Torta Especial",
      description: "Torta helada familiar con 3 sabores",
      originalPrice: 3500,
      promoPrice: 2800,
      image: "/multi-flavor-ice-cream-cake.png",
      badge: "ESPECIAL",
    },
  ]

  const productCategories = [
    {
      name: "Palitos",
      description: "De agua, bombón y crema",
      image: "/placeholder-jorvi.png",
      href: "/productos/palitos",
    },
    {
      name: "Tacitas",
      description: "Chocolate, frutilla y bomboncitos",
      image: "/ice-cream-cups.png",
      href: "/productos/tacitas",
    },
    {
      name: "Conos",
      description: "3 sabores: chocolate, vainilla, frutilla",
      image: "/placeholder-75reg.png",
      href: "/productos/conos",
    },
    {
      name: "Tortas Heladas",
      description: "Variedades clásicas y especiales",
      image: "/ice-cream-cakes-variety.png",
      href: "/productos/tortas",
    },
    {
      name: "Postres",
      description: "Familiares e individuales",
      image: "/ice-cream-tiramisu.png",
      href: "/productos/postres",
    },
    {
      name: "Criollos Frizados",
      description: "Chipás, donas, facturas",
      image: "/frozen-chipa-donut.png",
      href: "/productos/criollos",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">H</span>
              </div>
              <h1 className="text-2xl font-serif font-bold text-primary">Heladería Artesanal</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/productos" className="text-foreground hover:text-primary transition-colors">
                Productos
              </Link>
              <Link href="/promociones" className="text-foreground hover:text-primary transition-colors">
                Promociones
              </Link>
              <Link href="/nosotros" className="text-foreground hover:text-primary transition-colors">
                Nosotros
              </Link>
              <Link href="/contacto" className="text-foreground hover:text-primary transition-colors">
                Contacto
              </Link>
            </nav>
            <CartButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-card to-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            ¡Sumérgete en una Sinfonía de Sabores!
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Descubre nuestros helados artesanales, desde palitos hasta tortas heladas
          </p>
          <Button size="lg" className="text-lg px-8 py-3">
            Explorar Sabores
          </Button>
        </div>
      </section>

      {/* Featured Promotions */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              ¡Ofertas Dulces Solo Para Ti!
            </h3>
            <p className="text-lg text-muted-foreground">Disfruta de descuentos especiales en tus sabores favoritos</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredPromotions.map((promo) => (
              <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={promo.image || "/placeholder.svg"} alt={promo.title} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">{promo.badge}</Badge>
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-serif font-bold mb-2">{promo.title}</h4>
                  <p className="text-muted-foreground mb-4">{promo.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-accent">${promo.promoPrice}</span>
                      <span className="text-sm text-muted-foreground line-through">${promo.originalPrice}</span>
                    </div>
                  </div>
                  <Button className="w-full">¡Aprovechar Oferta!</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Explora Nuestras Delicias
            </h3>
            <p className="text-lg text-muted-foreground">Cada categoría tiene sabores únicos que te conquistarán</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.map((category) => (
              <Card key={category.name} className="overflow-hidden hover:shadow-lg transition-all hover:scale-105">
                <div className="relative">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h4 className="text-xl font-serif font-bold mb-2">{category.name}</h4>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={category.href}>Ver Productos</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-xl font-serif font-bold mb-2">Calidad Premium</h4>
              <p className="text-muted-foreground">Ingredientes seleccionados y procesos artesanales</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-xl font-serif font-bold mb-2">Siempre Fresco</h4>
              <p className="text-muted-foreground">Elaboración diaria para garantizar frescura</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Truck className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-xl font-serif font-bold mb-2">Entrega Rápida</h4>
              <p className="text-muted-foreground">Delivery en toda la ciudad manteniendo la cadena de frío</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">H</span>
                </div>
                <h5 className="text-lg font-serif font-bold">Heladería Artesanal</h5>
              </div>
              <p className="text-muted-foreground">
                Los mejores helados artesanales de la ciudad, hechos con amor y los mejores ingredientes.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Productos</h6>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/productos/palitos" className="hover:text-primary">
                    Palitos
                  </Link>
                </li>
                <li>
                  <Link href="/productos/tacitas" className="hover:text-primary">
                    Tacitas
                  </Link>
                </li>
                <li>
                  <Link href="/productos/conos" className="hover:text-primary">
                    Conos
                  </Link>
                </li>
                <li>
                  <Link href="/productos/tortas" className="hover:text-primary">
                    Tortas
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Empresa</h6>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/nosotros" className="hover:text-primary">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/contacto" className="hover:text-primary">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/promociones" className="hover:text-primary">
                    Promociones
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Contacto</h6>
              <div className="space-y-2 text-muted-foreground">
                <p>📍 Av. Principal 123, Ciudad</p>
                <p>📞 (011) 1234-5678</p>
                <p>✉️ info@heladeria.com</p>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 Heladería Artesanal. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function CartButton() {
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  return (
    <Link href="/carrito">
      <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
        <ShoppingCart className="w-4 h-4" />
        <span className="hidden sm:inline">Carrito ({itemCount})</span>
        <span className="sm:hidden">({itemCount})</span>
      </Button>
    </Link>
  )
}
