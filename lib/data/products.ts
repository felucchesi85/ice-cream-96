import type { Product } from "@/lib/types"

export const products: Product[] = [
  // Palitos
  {
    id: 1,
    name: "Palito de Agua",
    category: "palitos",
    flavors: ["Limón", "Frutilla", "Naranja", "Manzana Verde"],
    price: 500,
    stockType: "unidad",
    stock: 100,
    imageUrl: "/palito-agua.png",
    description: "Refrescante palito de agua con sabores naturales",
  },
  {
    id: 2,
    name: "Palito Bombón",
    category: "palitos",
    flavors: ["Chocolate", "Dulce de Leche", "Vainilla"],
    price: 800,
    stockType: "unidad",
    stock: 80,
    imageUrl: "/palito-bombon.png",
    description: "Cremoso palito cubierto de chocolate",
  },
  {
    id: 3,
    name: "Palito de Crema",
    category: "palitos",
    flavors: ["Vainilla", "Chocolate", "Frutilla", "Dulce de Leche"],
    price: 650,
    stockType: "unidad",
    stock: 90,
    imageUrl: "/palito-crema.png",
    description: "Suave palito de crema con sabores clásicos",
  },
  // Tacitas
  {
    id: 4,
    name: "Tacita de Chocolate",
    category: "tacitas",
    price: 1200,
    stockType: "unidad",
    stock: 50,
    imageUrl: "/tacita-chocolate.png",
    description: "Deliciosa tacita de helado de chocolate premium",
  },
  {
    id: 5,
    name: "Tacita de Frutilla",
    category: "tacitas",
    price: 1200,
    stockType: "unidad",
    stock: 45,
    imageUrl: "/tacita-frutilla.png",
    description: "Tacita de helado de frutilla con trozos naturales",
  },
  {
    id: 6,
    name: "Tacita Bomboncitos",
    category: "tacitas",
    price: 1400,
    stockType: "unidad",
    stock: 40,
    imageUrl: "/tacita-bomboncitos.png",
    description: "Tacita con mini bombones de chocolate",
  },
  // Conos
  {
    id: 7,
    name: "Cono Triple",
    category: "conos",
    flavors: ["Chocolate", "Vainilla", "Frutilla"],
    price: 1800,
    stockType: "unidad",
    stock: 30,
    imageUrl: "/cono-triple.png",
    description: "Cono con tres sabores clásicos",
  },
  // Tortas
  {
    id: 8,
    name: "Torta Chocolate",
    category: "tortas",
    price: 3500,
    stockType: "unidad",
    stock: 10,
    imageUrl: "/torta-chocolate.png",
    description: "Torta helada de chocolate para 8-10 porciones",
  },
  {
    id: 9,
    name: "Torta Especial Tiramisú",
    category: "tortas",
    price: 4200,
    stockType: "unidad",
    stock: 8,
    imageUrl: "/torta-tiramisu.png",
    description: "Torta helada especial sabor tiramisú",
  },
  // Postres
  {
    id: 10,
    name: "Postre Familiar Almendrado",
    category: "postres",
    price: 2800,
    stockType: "unidad",
    stock: 15,
    imageUrl: "/postre-almendrado.png",
    description: "Postre familiar de almendrado para 12 porciones",
  },
  {
    id: 11,
    name: "Postre Individual Frutilla",
    category: "postres",
    price: 800,
    stockType: "unidad",
    stock: 25,
    imageUrl: "/postre-individual-frutilla.png",
    description: "Postre individual de frutilla",
  },
  // Criollos
  {
    id: 12,
    name: "Chipás Frizados",
    category: "criollos",
    price: 1500,
    stockType: "bolsa",
    stock: 20,
    imageUrl: "/chipas-frizados.png",
    description: "Bolsa de chipás frizados para hornear (12 unidades)",
  },
  {
    id: 13,
    name: "Donas Frizadas",
    category: "criollos",
    price: 1800,
    stockType: "bolsa",
    stock: 18,
    imageUrl: "/donas-frizadas.png",
    description: "Bolsa de donas frizadas para hornear (8 unidades)",
  },
]

export const getProductsByCategory = (category: string) => {
  return products.filter((product) => product.category === category)
}

export const getProductById = (id: number) => {
  return products.find((product) => product.id === id)
}
