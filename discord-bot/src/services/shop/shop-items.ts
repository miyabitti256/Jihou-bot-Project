export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  effect: string;
  maxPerDay: number;
  enabled: boolean;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "omikuji_ticket",
    name: "おみくじ券",
    description: "おみくじをもう一度引くことができるチケット",
    price: 1500,
    category: "item",
    effect: "omikuji_redraw",
    maxPerDay: 1,
    enabled: true,
  },
];
