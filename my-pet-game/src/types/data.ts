export interface Pet {
  id: number;
  name: string;
  type: '家禽' | '鸟类' | '大型动物';
  levelRequired: number;
  health: number;
  happiness: number;
  cleanliness: number;
  description: string;
  specialAbility: string;
  likes: string;
  interaction: string;
  petLevel: number;
  petExp: number;
}

export interface Player {
  level: number;
  experience: number;
  coins: number;
  pets: Pet[];
}