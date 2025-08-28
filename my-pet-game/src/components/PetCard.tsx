import React from 'react';
import { Pet } from '../types/data';

interface Props {
  pet: Pet;
  onFeed: (petId: number) => void;
  onClean: (petId: number) => void;
  onPlay: (petId: number) => void;
}

const PetCard: React.FC<Props> = ({ pet, onFeed, onClean, onPlay }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex flex-col">
      <h3 className="text-xl font-bold mb-2">{pet.name} (Lv. {pet.petLevel})</h3>
      <p className="text-sm text-gray-600 mb-2">{pet.description}</p>
      <div className="flex-grow">
        <p><strong>生命值:</strong> {pet.health} / 100</p>
        <p><strong>快乐值:</strong> {pet.happiness} / 100</p>
        <p><strong>清洁度:</strong> {pet.cleanliness} / 100</p>
      </div>
      <div className="flex justify-around mt-4">
        <button 
          onClick={() => onFeed(pet.id)} 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          aria-label="喂食宠物"
          tabIndex={0}
        >
          喂食
        </button>
        <button 
          onClick={() => onClean(pet.id)} 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          aria-label="清洁宠物"
          tabIndex={0}
        >
          清洁
        </button>
        <button 
          onClick={() => onPlay(pet.id)} 
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          aria-label="与宠物玩耍"
          tabIndex={0}
        >
          玩耍
        </button>
      </div>
    </div>
  );
};

export default PetCard;