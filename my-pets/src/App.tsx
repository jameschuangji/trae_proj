import React, { useEffect, useState } from 'react';
import './App.css';
import { GameState } from './types/data';
import { 
  initializeGameState, 
  saveGameState, 
  updatePetStatus, 
  feedPet, 
  cleanPet, 
  playWithPet, 
  checkAndHandleLevelUp,
  adoptPet
} from './services/gameService';
import PlayerStats from './components/PlayerStats';
import PetCard from './components/PetCard';
import PetStore from './components/PetStore';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activeTab, setActiveTab] = useState<'pets' | 'store'>('pets');

  // 初始化游戏
  useEffect(() => {
    const initialState = initializeGameState();
    setGameState(initialState);
  }, []);

  // 定期更新宠物状态
  useEffect(() => {
    if (!gameState) return;

    const intervalId = setInterval(() => {
      setGameState(prevState => {
        if (!prevState) return null;
        
        const updatedState = updatePetStatus(prevState);
        saveGameState(updatedState);
        return updatedState;
      });
    }, 60000); // 每分钟更新一次

    // 每10秒检查一次升级
    const levelCheckId = setInterval(() => {
      setGameState(prevState => {
        if (!prevState) return null;
        
        const updatedState = checkAndHandleLevelUp(prevState);
        if (updatedState !== prevState) {
          saveGameState(updatedState);
        }
        return updatedState;
      });
    }, 10000);

    return () => {
      clearInterval(intervalId);
      clearInterval(levelCheckId);
    };
  }, [gameState]);

  // 处理宠物喂食
  const handleFeedPet = (petId: string) => {
    if (!gameState) return;
    
    const updatedState = feedPet(gameState, petId);
    setGameState(updatedState);
    saveGameState(updatedState);
  };

  // 处理宠物清洁
  const handleCleanPet = (petId: string) => {
    if (!gameState) return;
    
    const updatedState = cleanPet(gameState, petId);
    setGameState(updatedState);
    saveGameState(updatedState);
  };

  // 处理与宠物玩耍
  const handlePlayWithPet = (petId: string) => {
    if (!gameState) return;
    
    const updatedState = playWithPet(gameState, petId);
    setGameState(updatedState);
    saveGameState(updatedState);
  };

  // 处理领养宠物
  const handleAdoptPet = (petType: string) => {
    if (!gameState) return;
    
    const updatedState = adoptPet(gameState, petType);
    setGameState(updatedState);
    saveGameState(updatedState);
  };

  if (!gameState) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">我的宠物乐园</h1>
        
        {/* 玩家状态 */}
        <PlayerStats player={gameState.player} />
        
        {/* 标签切换 */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'pets' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('pets')}
          >
            我的宠物
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'store' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('store')}
          >
            宠物商店
          </button>
        </div>
        
        {/* 内容区域 */}
        {activeTab === 'pets' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameState.player.pets.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                你还没有宠物，去宠物商店领养一只吧！
              </div>
            ) : (
              gameState.player.pets.map(pet => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onFeed={() => handleFeedPet(pet.id)}
                  onClean={() => handleCleanPet(pet.id)}
                  onPlay={() => handlePlayWithPet(pet.id)}
                />
              ))
            )}
          </div>
        ) : (
          <PetStore
            availablePets={gameState.availablePets}
            playerLevel={gameState.player.level}
            onAdopt={handleAdoptPet}
          />
        )}
      </div>
    </div>
  );
}

export default App;
