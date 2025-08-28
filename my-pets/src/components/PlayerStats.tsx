import React from 'react';
import { Player } from '../types/data';

interface PlayerStatsProps {
  player: Player;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  const { level, experience, coins } = player;
  const experienceNeeded = level * 100; // 每级需要100点经验
  const experiencePercentage = Math.min(100, (experience / experienceNeeded) * 100);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-semibold">等级: {level}</h2>
          <p className="text-gray-600">金币: {coins}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">经验值: {experience}/{experienceNeeded}</p>
        </div>
      </div>
      
      {/* 经验条 */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-purple-600 h-2.5 rounded-full" 
          style={{ width: `${experiencePercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PlayerStats;