import React from 'react';
import { Player } from '../types/data';

interface Props {
  player: Player;
}

const PlayerStats: React.FC<Props> = ({ player }) => {
  const expForNextLevel = player.level * 100;
  const expPercentage = (player.experience / expForNextLevel) * 100;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">玩家状态</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-semibold">等级</p>
          <p className="text-2xl">{player.level}</p>
        </div>
        <div>
          <p className="text-lg font-semibold">金币</p>
          <p className="text-2xl">{player.coins} G</p>
        </div>
        <div>
          <p className="text-lg font-semibold">经验值</p>
          <p className="text-2xl">{player.experience} / {expForNextLevel}</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
        <div 
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${expPercentage}%` }}
          aria-label={`经验值进度: ${expPercentage.toFixed(0)}%`}
          role="progressbar"
          aria-valuenow={player.experience}
          aria-valuemin={0}
          aria-valuemax={expForNextLevel}
        ></div>
      </div>
    </div>
  );
};

export default PlayerStats;