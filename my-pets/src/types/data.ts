export interface Pet {
  id: string;
  name: string;
  type: 'chicken' | 'duck' | 'turkey' | 'parrot' | 'canary' | 'eagle' | 'pig' | 'goat' | 'pony';
  category: 'poultry' | 'bird' | 'large';
  hunger: number;
  happiness: number;
  cleanliness: number;
  unlockLevel: number;
  description: string;
  specialAbility: string;
  preferences: string;
  interactionMethod: string;
  imageUrl?: string;
}

export interface Player {
  level: number;
  experience: number;
  coins: number;
  pets: Pet[];
  unlockedPetTypes: string[];
}

export interface GameState {
  player: Player;
  availablePets: Pet[];
  lastUpdateTime: number;
}