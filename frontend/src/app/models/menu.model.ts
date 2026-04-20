// menu.model.ts

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;  // e.g., 'burgers', 'pizzas', 'drinks'
  imageUrl?: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

