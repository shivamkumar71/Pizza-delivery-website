export const pizzas = [
  {
    id: 1,
    name: "Margherita Classic",
    description: "Traditional Italian pizza with fresh mozzarella, tomato sauce, and fresh basil",
    price: 299,
    image: "🍕",
    ingredients: ["Mozzarella", "Tomato Sauce", "Fresh Basil", "Olive Oil"],
    category: "Classic",
    spicy: false,
    vegetarian: true,
    popular: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: 2,
    name: "Pepperoni Supreme",
    description: "Spicy pepperoni slices with melted cheese and tangy tomato sauce",
    price: 399,
    image: "🍕",
    ingredients: ["Pepperoni", "Mozzarella", "Tomato Sauce", "Oregano"],
    category: "Meat",
    spicy: true,
    vegetarian: false,
    popular: true,
    rating: 4.9,
    reviews: 203
  },
  {
    id: 3,
    name: "Veggie Delight",
    description: "Fresh vegetables including bell peppers, mushrooms, onions, and olives",
    price: 349,
    image: "🍕",
    ingredients: ["Bell Peppers", "Mushrooms", "Onions", "Olives", "Mozzarella"],
    category: "Vegetarian",
    spicy: false,
    vegetarian: true,
    popular: false,
    rating: 4.6,
    reviews: 98
  },
  {
    id: 4,
    name: "Chicken Tikka",
    description: "Indian-inspired pizza with tender chicken tikka, onions, and coriander",
    price: 449,
    image: "🍕",
    ingredients: ["Chicken Tikka", "Onions", "Coriander", "Mozzarella", "Tikka Sauce"],
    category: "Fusion",
    spicy: true,
    vegetarian: false,
    popular: true,
    rating: 4.7,
    reviews: 134
  },
  {
    id: 5,
    name: "BBQ Chicken",
    description: "Smoky BBQ sauce with grilled chicken, red onions, and cilantro",
    price: 429,
    image: "🍕",
    ingredients: ["Grilled Chicken", "BBQ Sauce", "Red Onions", "Cilantro", "Mozzarella"],
    category: "BBQ",
    spicy: false,
    vegetarian: false,
    popular: false,
    rating: 4.5,
    reviews: 87
  }
];

export const categories = [
  "All",
  "Classic",
  "Meat",
  "Vegetarian",
  "Fusion",
  "BBQ"
];

export const sizes = [
  { name: "Small", multiplier: 0.8, label: "S" },
  { name: "Medium", multiplier: 1.0, label: "M" },
  { name: "Large", multiplier: 1.3, label: "L" }
];
