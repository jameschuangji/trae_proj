import React from 'react';
import { gameService } from '../services/gameService';

interface Props {
  playerLevel: number;
  onAdopt: (petName: string) => void;
}

const PetStore: React.FC<Props> = ({ playerLevel, onAdopt }) => {
  const availablePets = gameService.getAvailablePets(playerLevel);

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">宠物商店</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {availablePets.map(pet => (
          <div key={pet.name} className="p-4 border rounded-lg text-center">
            <h3 className="font-bold">{pet.name}</h3>
            <p className="text-sm">需要等级: {pet.levelRequired}</p>
            <button 
              onClick={() => onAdopt(pet.name)} 
              className="mt-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded"
              aria-label={`领养${pet.name}`}
              tabIndex={0}
            >
              领养
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetStore;