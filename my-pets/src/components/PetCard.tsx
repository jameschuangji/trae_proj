import React, { useState } from 'react';
import { Pet } from '../types/data';

interface PetCardProps {
  pet: Pet;
  onFeed: () => void;
  onClean: () => void;
  onPlay: () => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onFeed, onClean, onPlay }) => {
  // 添加动画状态
  const [isEating, setIsEating] = useState(false);
  const [showFoodIcon, setShowFoodIcon] = useState(false);
  const [foodPosition, setFoodPosition] = useState({ x: 0, y: 0 });

  // 根据宠物类型选择图标（实际项目中应该使用真实图片）
  const getPetEmoji = (type: string): string => {
    const emojiMap: Record<string, string> = {
      chicken: '🐔',
      duck: '🦆',
      turkey: '🦃',
      parrot: '🦜',
      canary: '🐦',
      eagle: '🦅',
      pig: '🐷',
      goat: '🐐',
      pony: '🐴'
    };
    return emojiMap[type] || '🐾';
  };

  // 状态条颜色
  const getStatusColor = (value: number): string => {
    if (value > 70) return 'bg-green-500';
    if (value > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 处理喂食动画
  const handleFeedWithAnimation = () => {
    // 设置食物图标位置（随机位置，让每次喂食位置不同）
    setFoodPosition({
      x: Math.random() * 40 - 20, // -20px 到 20px 之间的随机值
      y: Math.random() * 20 - 40, // -40px 到 -20px 之间的随机值
    });
    
    // 显示食物图标
    setShowFoodIcon(true);
    
    // 开始吃食动画
    setIsEating(true);
    
    // 调用实际的喂食函数
    onFeed();
    
    // 动画结束后重置状态
    setTimeout(() => {
      setIsEating(false);
      setTimeout(() => {
        setShowFoodIcon(false);
      }, 300);
    }, 1000);
  };

  // 根据宠物类型选择食物图标
  const getFoodEmoji = (type: string): string => {
    const foodMap: Record<string, string> = {
      chicken: '🌽', // 玉米
      duck: '🍞', // 面包
      turkey: '🌾', // 谷物
      parrot: '🍎', // 苹果
      canary: '🌱', // 种子
      eagle: '🥩', // 肉
      pig: '🥔', // 土豆
      goat: '🥬', // 蔬菜
      pony: '🥕'  // 胡萝卜
    };
    return foodMap[type] || '🍽️';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{pet.name}</h3>
          <span className={`text-4xl transition-transform ${isEating ? 'animate-eating' : ''}`}>
            {getPetEmoji(pet.type)}
          </span>
        </div>
        
        {/* 食物图标 - 条件渲染 */}
        {showFoodIcon && (
          <div 
            className="absolute animate-fadeIn" 
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${foodPosition.x}px), calc(-50% + ${foodPosition.y}px))`,
              zIndex: 10,
              fontSize: '1.5rem'
            }}
          >
            <span className="animate-slideUp inline-block">{getFoodEmoji(pet.type)}</span>
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-4">{pet.description}</p>
        
        {/* 状态条 */}
        <div className="space-y-2 mb-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>饥饿度</span>
              <span>{Math.round(pet.hunger)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${getStatusColor(pet.hunger)} h-2 rounded-full transition-all duration-500 ease-out`} 
                style={{ width: `${pet.hunger}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>幸福度</span>
              <span>{Math.round(pet.happiness)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${getStatusColor(pet.happiness)} h-2 rounded-full transition-all duration-500 ease-out`} 
                style={{ width: `${pet.happiness}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>清洁度</span>
              <span>{Math.round(pet.cleanliness)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${getStatusColor(pet.cleanliness)} h-2 rounded-full transition-all duration-500 ease-out`} 
                style={{ width: `${pet.cleanliness}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* 特殊能力和喜好 */}
        <div className="text-xs text-gray-600 mb-4">
          <p><span className="font-semibold">特殊能力:</span> {pet.specialAbility}</p>
          <p><span className="font-semibold">喜好:</span> {pet.preferences}</p>
        </div>
      </div>
      
      {/* 互动按钮 */}
      <div className="flex border-t border-gray-200">
        <button 
          className="flex-1 py-2 text-center text-sm font-medium text-green-600 hover:bg-green-50 transition-colors relative overflow-hidden"
          onClick={handleFeedWithAnimation}
          aria-label="喂食"
          disabled={isEating}
        >
          <span className={isEating ? 'opacity-0' : ''}>喂食</span>
          {isEating && (
            <span className="absolute inset-0 flex items-center justify-center animate-pulse">喂食中...</span>
          )}
        </button>
        <button 
          className="flex-1 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors border-l border-gray-200"
          onClick={onClean}
          aria-label="清洁"
        >
          清洁
        </button>
        <button 
          className="flex-1 py-2 text-center text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors border-l border-gray-200"
          onClick={onPlay}
          aria-label="玩耍"
        >
          玩耍
        </button>
      </div>
    </div>
  );
};

export default PetCard;