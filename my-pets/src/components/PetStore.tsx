import React from 'react';
import { Pet } from '../types/data';

interface PetStoreProps {
  availablePets: Pet[];
  playerLevel: number;
  onAdopt: (petType: string) => void;
}

const PetStore: React.FC<PetStoreProps> = ({ availablePets, playerLevel, onAdopt }) => {
  // 根据宠物类型选择图标
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

  // 按解锁等级对宠物进行分组
  const petsByLevel: Record<number, Pet[]> = {};
  
  // 收集所有可能的宠物（包括未解锁的）
  const allPets = [...availablePets];
  
  // 将宠物按解锁等级分组
  allPets.forEach(pet => {
    if (!petsByLevel[pet.unlockLevel]) {
      petsByLevel[pet.unlockLevel] = [];
    }
    petsByLevel[pet.unlockLevel].push(pet);
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">宠物商店</h2>
      
      {availablePets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          目前没有可领养的宠物，请继续升级解锁更多宠物！
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availablePets.map(pet => (
            <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{pet.name}</h3>
                  <span className="text-4xl">{getPetEmoji(pet.type)}</span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{pet.description}</p>
                
                {/* 特殊能力和喜好 */}
                <div className="text-xs text-gray-600 mb-4">
                  <p><span className="font-semibold">特殊能力:</span> {pet.specialAbility}</p>
                  <p><span className="font-semibold">喜好:</span> {pet.preferences}</p>
                  <p><span className="font-semibold">互动方式:</span> {pet.interactionMethod}</p>
                </div>
                
                <button 
                  className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  onClick={() => onAdopt(pet.type)}
                  disabled={pet.unlockLevel > playerLevel}
                  aria-label={`领养${pet.name}`}
                >
                  领养
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetStore;