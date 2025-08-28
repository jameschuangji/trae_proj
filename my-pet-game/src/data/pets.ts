import { Pet } from '../types/data';

export const ALL_PETS: Omit<Pet, 'id' | 'petLevel' | 'petExp'>[] = [
  // 家禽类
  {
    name: '小鸡',
    type: '家禽',
    levelRequired: 1,
    health: 100,
    happiness: 80,
    cleanliness: 90,
    description: '成长快，容易照顾',
    specialAbility: '每天产蛋（可获得额外金币）',
    likes: '谷物食品，阳光下活动',
    interaction: '喂食、抚摸、教唱歌',
  },
  {
    name: '鸭子',
    type: '家禽',
    levelRequired: 2,
    health: 120,
    happiness: 85,
    cleanliness: 70,
    description: '喜欢游泳，需要定期清洁',
    specialAbility: '游泳加速（水中移动速度提升）',
    likes: '水生植物，水域环境',
    interaction: '喂食、游泳、捉虫子',
  },
  {
    name: '火鸡',
    type: '家禽',
    levelRequired: 4,
    health: 150,
    happiness: 75,
    cleanliness: 80,
    description: '体型较大，食量大',
    specialAbility: '高声鸣叫（可唤醒其他宠物）',
    likes: '混合谷物，开阔场地',
    interaction: '喂食、梳理羽毛、训练展示',
  },
  // 鸟类
  {
    name: '鹦鹉',
    type: '鸟类',
    levelRequired: 3,
    health: 90,
    happiness: 95,
    cleanliness: 85,
    description: '聪明，会学说话',
    specialAbility: '模仿语言（可学习玩家教授的短语）',
    likes: '水果，互动游戏',
    interaction: '教说话、玩耍、喂食',
  },
];