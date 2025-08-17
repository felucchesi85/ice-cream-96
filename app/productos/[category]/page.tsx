import { getProductsByCategory } from "@/lib/data/products"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const categoryNames = {
  palitos: "Palitos",
  tacitas: "Tacitas",
  conos: "Conos",
  tortas: "Tortas Heladas",
  postres: "Postres",
  criollos: "Criollos Frizados",
}

const categoryDescriptions = {
  palitos: "Refrescantes palitos de agua, bombón y crema con múltiples sabores",
  tacitas: "Deliciosas tacitas de helado de chocolate, frutilla y bomboncitos",
  conos: "Conos con tres sabores clásicos: chocolate, vainilla y frutilla",
  tortas: "Tortas heladas familiares y especiales para toda ocasión",
  postres: "Postres familiares e individuales con sabores únicos",
  criollos: "Productos frizados para hornear: chipás, donas y facturas",
}

interface ProductCategoryPageProps {
  params: {
    category: string
  }
}

export default function ProductCategoryPage({ params }: ProductCategoryPageProps) {
  const { category } = params
  const products = getProductsByCategory(category)

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold mb-4">Categoría no encontrada</h1>
            <Link href="/">
              <Button>Volver al inicio</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const categoryName = categoryNames[category as keyof typeof categoryNames] || category
  const categoryDescription = categoryDescriptions[category as keyof typeof categoryDescriptions] || ""

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-serif font-bold text-primary">{categoryName}</h1>
                <p className="text-muted-foreground">{categoryDescription}</p>
              </div>
            </div>
            <Link href="/carrito">
              <Button variant="outline" size="sm">
                Ver Carrito
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  )
}
