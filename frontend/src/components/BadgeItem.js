import React from 'react';

export default function BadgeItem({ badge, locked = false }) {
  return (
    <div className={`text-center ${locked ? 'opacity-50' : ''}`}>
      <div className={`
        w-20 h-20 rounded-full flex items-center justify-center mb-2
        ${locked 
          ? 'bg-gray-300 dark:bg-gray-600' 
          : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
        }
      `}>
        <span className="text-3xl">{badge.icon}</span>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
        {badge.name}
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
        {badge.description}
      </p>
      {locked && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
          {badge.unlockedAt || 'Locked'}
        </p>
      )}
    </div>
  );
}
