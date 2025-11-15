import React from 'react';
import { stickers, categories } from '../../data/stickers';
import NewSticker from './NewSticker';

export default function StickerSidebar({ selectedCategory, onCategoryChange }) {
  const filteredStickers = selectedCategory
    ? stickers.filter(s => s.category === selectedCategory)
    : stickers;

  return (
    <div className="w-full md:w-80 sm:w-10 bg-white md:border-r border-gray-200 overflow-y-auto flex-shrink-0">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Sticker Library</h2>
      </div>

      {/* Categories */}
      <div className="p-3 md:p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap ${
              !selectedCategory ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap flex items-center space-x-1 ${
                selectedCategory === category.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stickers Grid */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {filteredStickers.map((sticker) => (
            <NewSticker key={sticker.id} sticker={sticker} />
          ))}
        </div>
      </div>
    </div>
  );
}
