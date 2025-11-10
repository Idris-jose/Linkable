import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  STICKER: 'sticker'
};

export default function NewSticker({ sticker }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.STICKER,
    item: { ...sticker, isPlaced: false },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`cursor-grab active:cursor-grabbing p-2 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <img
        src={sticker.src}
        alt={sticker.name}
        className="w-full h-12 object-contain mb-1 pointer-events-none"
        draggable={false}
      />
      <p className="text-xs text-center text-gray-600 truncate">{sticker.name}</p>
    </div>
  );
}
