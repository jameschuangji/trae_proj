import { Player, Pet } from '../types/data';
import { ALL_PETS } from '../data/pets';

const PLAYER_STORAGE_KEY = 'my-pet-game-player';

export const gameService = {
  loadPlayer: (): Player => {
    const savedPlayer = localStorage.getItem(PLAYER_STORAGE_KEY);
    if (savedPlayer) {
      return JSON.parse(savedPlayer);
    }
    // 返回一个初始玩家状态
    return {
      level: 1,
      experience: 0,
      coins: 100,
      pets: [],
    };
  },

  savePlayer: (player: Player) => {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(player));
  },

  // 喂食宠物
  feedPet: (player: Player, petId: number): Player => {
    const newPlayer = { ...player };
    const pet = newPlayer.pets.find(p => p.id === petId);
    if (!pet || newPlayer.coins < 10) return newPlayer; // 假设喂食消耗10金币

    pet.health = Math.min(100, pet.health + 15);
    newPlayer.coins -= 10;
    newPlayer.experience += 5;
    gameService.savePlayer(newPlayer);
    return newPlayer;
  },

  // 清洁宠物
  cleanPet: (player: Player, petId: number): Player => {
    const newPlayer = { ...player };
    const pet = newPlayer.pets.find(p => p.id === petId);
    if (!pet || newPlayer.coins < 15) return newPlayer; // 假设清洁消耗15金币

    pet.cleanliness = Math.min(100, pet.cleanliness + 20);
    newPlayer.coins -= 15;
    newPlayer.experience += 8;
    gameService.savePlayer(newPlayer);
    return newPlayer;
  },

  // 与宠物玩耍
  playWithPet: (player: Player, petId: number): Player => {
    const newPlayer = { ...player };
    const pet = newPlayer.pets.find(p => p.id === petId);
    if (!pet || newPlayer.coins < 5) return newPlayer; // 假设玩耍消耗5金币

    pet.happiness = Math.min(100, pet.happiness + 25);
    newPlayer.coins -= 5;
    newPlayer.experience += 10;
    gameService.savePlayer(newPlayer);
    return newPlayer;
  },

  // 宠物状态随时间衰减
  updatePetStatus: (player: Player): Player => {
    const newPlayer = { ...player };
    newPlayer.pets.forEach(pet => {
      pet.health = Math.max(0, pet.health - 2);
      pet.happiness = Math.max(0, pet.happiness - 3);
      pet.cleanliness = Math.max(0, pet.cleanliness - 1);
    });
    gameService.savePlayer(newPlayer);
    return newPlayer;
  },

  // 玩家等级提升
  levelUp: (player: Player): Player => {
    const newPlayer = { ...player };
    const expForNextLevel = newPlayer.level * 100; // 简化升级经验计算
    if (newPlayer.experience >= expForNextLevel) {
      newPlayer.level++;
      newPlayer.experience -= expForNextLevel;
      newPlayer.coins += 50; // 升级奖励
    }
    gameService.savePlayer(newPlayer);
    return newPlayer;
  },

  // 解锁新宠物
  getAvailablePets: (playerLevel: number): Omit<Pet, 'id' | 'petLevel' | 'petExp'>[] => {
    return ALL_PETS.filter(pet => playerLevel >= pet.levelRequired);
  },

  // 领养新宠物
  adoptPet: (player: Player, petName: string): Player => {
    const newPlayer = { ...player };
    const petData = ALL_PETS.find(p => p.name === petName);
    if (!petData || newPlayer.level < petData.levelRequired) return newPlayer;

    const newPet: Pet = {
      ...petData,
      id: Date.now(),
      petLevel: 1,
      petExp: 0,
    };

    newPlayer.pets.push(newPet);
    gameService.savePlayer(newPlayer);
    return newPlayer;
  },
};