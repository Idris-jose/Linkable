import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight, X } from 'lucide-react';

export default function StickerControls({ selectedSticker, onUpdate, onDeselect }) {
  if (!selectedSticker) return null;

  const handleNudge = (direction) => {
    const nudgeAmount = 1; // pixels
    const updates = {};
    switch (direction) {
      case 'up':
        updates.y = Math.max(0, (selectedSticker.y || 0) - nudgeAmount);
        break;
      case 'down':
        updates.y = Math.min(400, (selectedSticker.y || 0) + nudgeAmount); // rough max height
        break;
      case 'left':
        updates.x = Math.max(0, (selectedSticker.x || 0) - nudgeAmount);
        break;
      case 'right':
        updates.x = Math.min(300, (selectedSticker.x || 0) + nudgeAmount); // rough max width
        break;
    }
    onUpdate(selectedSticker.id, updates);
  };

  const handleInputChange = (field, value) => {
    let clampedValue = value;
    if (field === 'x' || field === 'y') {
      clampedValue = Math.max(0, Math.min(300, parseFloat(value) || 0)); // rough bounds
    } else if (field === 'width' || field === 'height') {
      clampedValue = Math.max(30, Math.min(150, parseFloat(value) || 60));
    } else if (field === 'rotation') {
      clampedValue = (parseFloat(value) || 0) % 360;
    }
    onUpdate(selectedSticker.id, { [field]: clampedValue });
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-3 md:p-4 shadow-xl z-50 max-w-sm w-full mx-4 md:mx-0">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h3 className="font-semibold text-gray-900 text-sm md:text-base">Sticker Controls</h3>
        <button onClick={onDeselect} className="text-gray-500 hover:text-gray-700">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Position X</label>
          <input
            type="number"
            value={selectedSticker.x || 0}
            onChange={(e) => handleInputChange('x', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            min="0"
            max="300"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Position Y</label>
          <input
            type="number"
            value={selectedSticker.y || 0}
            onChange={(e) => handleInputChange('y', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            min="0"
            max="400"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Width</label>
          <input
            type="number"
            value={selectedSticker.width || 60}
            onChange={(e) => handleInputChange('width', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            min="30"
            max="150"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Height</label>
          <input
            type="number"
            value={selectedSticker.height || 60}
            onChange={(e) => handleInputChange('height', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            min="30"
            max="150"
          />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-500 block mb-1">Rotation (°)</label>
          <input
            type="number"
            value={selectedSticker.rotation || 0}
            onChange={(e) => handleInputChange('rotation', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            min="0"
            max="360"
          />
        </div>
      </div>
      <div className="flex justify-center space-x-1">
        <button onClick={() => handleNudge('left')} className="p-1 text-gray-500 hover:text-indigo-600"><ArrowLeftIcon className="w-4 h-4" /></button>
        <button onClick={() => handleNudge('up')} className="p-1 text-gray-500 hover:text-indigo-600"><ArrowUp className="w-4 h-4" /></button>
        <button onClick={() => handleNudge('down')} className="p-1 text-gray-500 hover:text-indigo-600"><ArrowDown className="w-4 h-4" /></button>
        <button onClick={() => handleNudge('right')} className="p-1 text-gray-500 hover:text-indigo-600"><ArrowRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
