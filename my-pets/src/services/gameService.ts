import { GameState, Pet, Player } from '../types/data';
import { PETS_DATA } from '../data/pets';

// 经验值常量
const EXPERIENCE_PER_LEVEL = 100;
const EXPERIENCE_FOR_FEEDING = 5;
const EXPERIENCE_FOR_CLEANING = 3;
const EXPERIENCE_FOR_PLAYING = 4;

// 金币常量
const COINS_FOR_FEEDING = 2;
const COINS_FOR_CLEANING = 1;
const COINS_FOR_PLAYING = 3;

// 状态衰减率（每分钟）
const HUNGER_DECAY_RATE = 1; // 每分钟饥饿度下降1点
const HAPPINESS_DECAY_RATE = 1.5; // 每分钟幸福度下降1.5点
const CLEANLINESS_DECAY_RATE = 0.8; // 每分钟清洁度下降0.8点

// 初始化新玩家
export const initializeNewPlayer = (): Player => {
  return {
    level: 1,
    experience: 0,
    coins: 50,
    pets: [],
    unlockedPetTypes: ['chicken'] // 初始只解锁小鸡
  };
};

// 初始化游戏状态
export const initializeGameState = (): GameState => {
  const savedState = localStorage.getItem('petGameState');
  if (savedState) {
    const parsedState = JSON.parse(savedState) as GameState;
    return {
      ...parsedState,
      lastUpdateTime: Date.now()
    };
  }
  
  return {
    player: initializeNewPlayer(),
    availablePets: PETS_DATA.filter(pet => pet.unlockLevel === 1),
    lastUpdateTime: Date.now()
  };
};

// 保存游戏状态
export const saveGameState = (state: GameState): void => {
  localStorage.setItem('petGameState', JSON.stringify({
    ...state,
    lastUpdateTime: Date.now()
  }));
};

// 更新宠物状态（基于时间流逝）
export const updatePetStatus = (gameState: GameState): GameState => {
  const currentTime = Date.now();
  const minutesPassed = (currentTime - gameState.lastUpdateTime) / (1000 * 60);
  
  if (minutesPassed < 0.01) { // 不到1秒钟，不更新
    return gameState;
  }
  
  const updatedPets = gameState.player.pets.map(pet => {
    return {
      ...pet,
      hunger: Math.max(0, pet.hunger - HUNGER_DECAY_RATE * minutesPassed),
      happiness: Math.max(0, pet.happiness - HAPPINESS_DECAY_RATE * minutesPassed),
      cleanliness: Math.max(0, pet.cleanliness - CLEANLINESS_DECAY_RATE * minutesPassed)
    };
  });
  
  return {
    ...gameState,
    player: {
      ...gameState.player,
      pets: updatedPets
    },
    lastUpdateTime: currentTime
  };
};

// 喂食宠物
export const feedPet = (gameState: GameState, petId: string): GameState => {
  const petIndex = gameState.player.pets.findIndex(pet => pet.id === petId);
  if (petIndex === -1) return gameState;
  
  const updatedPets = [...gameState.player.pets];
  updatedPets[petIndex] = {
    ...updatedPets[petIndex],
    hunger: Math.min(100, updatedPets[petIndex].hunger + 20)
  };
  
  return {
    ...gameState,
    player: {
      ...gameState.player,
      pets: updatedPets,
      experience: gameState.player.experience + EXPERIENCE_FOR_FEEDING,
      coins: gameState.player.coins + COINS_FOR_FEEDING
    }
  };
};

// 清洁宠物
export const cleanPet = (gameState: GameState, petId: string): GameState => {
  const petIndex = gameState.player.pets.findIndex(pet => pet.id === petId);
  if (petIndex === -1) return gameState;
  
  const updatedPets = [...gameState.player.pets];
  updatedPets[petIndex] = {
    ...updatedPets[petIndex],
    cleanliness: Math.min(100, updatedPets[petIndex].cleanliness + 15)
  };
  
  return {
    ...gameState,
    player: {
      ...gameState.player,
      pets: updatedPets,
      experience: gameState.player.experience + EXPERIENCE_FOR_CLEANING,
      coins: gameState.player.coins + COINS_FOR_CLEANING
    }
  };
};

// 与宠物玩耍
export const playWithPet = (gameState: GameState, petId: string): GameState => {
  const petIndex = gameState.player.pets.findIndex(pet => pet.id === petId);
  if (petIndex === -1) return gameState;
  
  const updatedPets = [...gameState.player.pets];
  updatedPets[petIndex] = {
    ...updatedPets[petIndex],
    happiness: Math.min(100, updatedPets[petIndex].happiness + 25)
  };
  
  return {
    ...gameState,
    player: {
      ...gameState.player,
      pets: updatedPets,
      experience: gameState.player.experience + EXPERIENCE_FOR_PLAYING,
      coins: gameState.player.coins + COINS_FOR_PLAYING
    }
  };
};

// 检查并处理玩家升级
export const checkAndHandleLevelUp = (gameState: GameState): GameState => {
  const { level, experience } = gameState.player;
  const experienceNeeded = level * EXPERIENCE_PER_LEVEL;
  
  if (experience >= experienceNeeded) {
    const newLevel = level + 1;
    
    // 解锁新宠物类型
    const newUnlockedPets = PETS_DATA
      .filter(pet => pet.unlockLevel === newLevel)
      .map(pet => pet.type);
    
    const updatedUnlockedTypes = [
      ...gameState.player.unlockedPetTypes,
      ...newUnlockedPets
    ];
    
    // 更新可用宠物列表
    const updatedAvailablePets = PETS_DATA.filter(
      pet => updatedUnlockedTypes.includes(pet.type) && 
      !gameState.player.pets.some(playerPet => playerPet.type === pet.type)
    );
    
    return {
      ...gameState,
      player: {
        ...gameState.player,
        level: newLevel,
        experience: experience - experienceNeeded,
        unlockedPetTypes: Array.from(new Set(updatedUnlockedTypes))
      },
      availablePets: updatedAvailablePets
    };
  }
  
  return gameState;
};

// 领养新宠物
export const adoptPet = (gameState: GameState, petType: string): GameState => {
  // 检查玩家等级是否足够
  const petToAdopt = PETS_DATA.find(pet => pet.type === petType);
  if (!petToAdopt || petToAdopt.unlockLevel > gameState.player.level) {
    return gameState;
  }
  
  // 检查玩家是否已经拥有该类型的宠物
  if (gameState.player.pets.some(pet => pet.type === petType)) {
    return gameState;
  }
  
  // 创建新宠物实例
  const newPet: Pet = {
    ...petToAdopt,
    id: `${petType}${Date.now()}`, // 创建唯一ID
    hunger: 100,
    happiness: 100,
    cleanliness: 100
  };
  
  // 更新可用宠物列表
  const updatedAvailablePets = gameState.availablePets.filter(
    pet => pet.type !== petType
  );
  
  return {
    ...gameState,
    player: {
      ...gameState.player,
      pets: [...gameState.player.pets, newPet]
    },
    availablePets: updatedAvailablePets
  };
};