import { Pet } from '../types/data';

export const PETS_DATA: Pet[] = [
  // 家禽类
  {
    id: 'chicken1',
    name: '小鸡',
    type: 'chicken',
    category: 'poultry',
    hunger: 100,
    happiness: 100,
    cleanliness: 100,
    unlockLevel: 1,
    description: '活泼可爱的小鸡，是初学者的理想选择。',
    specialAbility: '每天早晨会生一个蛋，可以增加少量金币。',
    preferences: '喜欢在阳光下散步和吃谷物。',
    interactionMethod: '轻轻抚摸它的羽毛会让它很开心。'
  },
  {
    id: 'duck1',
    name: '鸭子',
    type: 'duck',
    category: 'poultry',
    hunger: 100,
    happiness: 100,
    cleanliness: 100,
    unlockLevel: 2,
    description: '喜欢游泳的鸭子，性格温顺。',
    specialAbility: '游泳时可以找到特殊物品，增加金币奖励。',
    preferences: '喜欢水域环境和各种水生植物。',
    interactionMethod: '带它去游泳会大大提高它的心情。'
  },
  {
    id: 'turkey1',
    name: '火鸡',
    type: 'turkey',
    category: 'poultry',
    hunger: 100,
    happiness: 100,
    cleanliness: 100,
    unlockLevel: 3,
    description: '体型较大的火鸡，羽毛丰富多彩。',
    specialAbility: '节日期间可以提供双倍金币奖励。',
    preferences: '喜欢开阔的空间和各种坚果。',
    interactionMethod: '模仿它的叫声会让它感到亲近。'
  },
  
  // 鸟类
  {
    id: 'parrot1',
    name: '鹦鹉',
    type: 'parrot',
    category: 'bird',
    hunger: 100,
    happiness: 100,
    cleanliness: 100,
    unlockLevel: 4,
    description: '聪明的鹦鹉，能够学习简单的词语。',
    specialAbility: '可以学习新词语，每学会一个新词语获得额外经验。',
    preferences: '喜欢热带水果和明亮的玩具。',
    interactionMethod: '教它说话是增强关系的最佳方式。'
  },
  {
    id: 'canary1',
    name: '金丝雀',
    type: 'canary',
    category: 'bird',
    hunger: 100,
    happiness: 100,
    cleanliness: 100,
    unlockLevel: 5,
    description: '歌声动听的金丝雀，羽毛金黄。',
    specialAbility: '唱歌可以提高周围所有宠物的幸福度。',
    preferences: '喜欢安静的环境和精细的种子。',
    interactionMethod: '播放轻柔的音乐会鼓励它歌唱。'
  },
  {
    id: 'eagle1',
    name: '老鹰',
    type: 'eagle',
    category: 'bird',
    hunger: 100,
    happiness: 100,
    cleanliness: 100,
    unlockLevel: 6,
    description: '威严的老鹰，视力极佳。',
    specialAbility: '可以发现隐藏的宝藏，获得稀有物品。',
    preferences: '喜欢高处和新鲜的肉类食物。',
    interactionMethod: '让它展翅飞翔可以极大提升它的满意度。'
  },
  
  // 大型动物
  {
    id: 'pig1',
    name: '小猪',
    type: 'pig',
    category: 'large',
    hunger: 100,
    happiness: 100,
    cleanliness: 100,
    unlockLevel: 7,
    description: '贪吃的小猪，总是充满活力。',
    specialAbility: '可以帮助寻找埋在地下的物品，增加金币收入。',
    preferences: '喜欢泥浆浴和各种蔬果。',
    interactionMethod: '挠它的肚子会让它非常开心。'
  },
  {
    id: 'goat1',
    name: '山羊',
    type: 'goat',
    category: 'large',
    hunger: 100,
    happiness: 100,
    cleanliness: 100,
    unlockLevel: 8,
    description: '顽皮的山羊，喜欢爬上各种地方。',
    specialAbility: '可以清理杂草，每天提供额外的经验值。',
    preferences: '喜欢攀爬和嚼食各种植物。',
    interactionMethod: '和它一起爬山会建立深厚的感情。'
  },
  {
    id: 'pony1',
    name: '小马',
    type: 'pony',
    category: 'large',
    hunger: 100,
    happiness: 100,
    cleanliness: 100,
    unlockLevel: 9,
    description: '优雅的小马，速度快且忠诚。',
    specialAbility: '可以带玩家去探险，发现稀有资源。',
    preferences: '喜欢开阔的草原和胡萝卜。',
    interactionMethod: '骑乘和梳理它的鬃毛可以增强友谊。'
  }
];