import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ResizableBox } from 'react-resizable';
import { stickers, categories } from '../data/stickers';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Save, Trash2, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import 'react-resizable/css/styles.css';

const ItemTypes = {
  STICKER: 'sticker'
};

function DraggableSticker({ sticker, onDelete, onUpdate }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.STICKER,
    item: { ...sticker },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`cursor-move ${isDragging ? 'opacity-50' : ''}`}
      style={{
        position: 'absolute',
        left: sticker.x || 0,
        top: sticker.y || 0,
        zIndex: sticker.zIndex || 1
      }}
    >
      <ResizableBox
        width={sticker.width || 60}
        height={sticker.height || 60}
        minConstraints={[30, 30]}
        maxConstraints={[150, 150]}
        onResizeStop={(e, { size }) => {
          onUpdate(sticker.id, { width: size.width, height: size.height });
        }}
        className="relative group"
      >
        <img
          src={sticker.src}
          alt={sticker.name}
          className="w-full h-full object-contain"
          style={{
            transform: `rotate(${sticker.rotation || 0}deg)`
          }}
        />
        <button
          onClick={() => onDelete(sticker.id)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </button>
        <button
          onClick={() => onUpdate(sticker.id, { rotation: (sticker.rotation || 0) + 45 })}
          className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </ResizableBox>
    </div>
  );
}

function StickerCanvas({ placedStickers, onDrop, onDelete, onUpdate }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.STICKER,
    drop: (item, monitor) => {
      console.log('Drop function called');
      const offset = monitor.getClientOffset();
      const dropElement = document.getElementById('sticker-canvas');
      console.log('Drop element:', dropElement);
      console.log('Client offset:', offset);
      if (!dropElement || !offset) {
        console.log('No drop element or offset, returning');
        return;
      }

      const rect = dropElement.getBoundingClientRect();
      console.log('Canvas rect:', rect);
      const x = offset.x - rect.left;
      const y = offset.y - rect.top;
      console.log('Calculated coordinates:', { x, y });

      const newSticker = {
        ...item,
        x: Math.max(0, Math.min(x - (item.width || 60) / 2, rect.width - (item.width || 60))),
        y: Math.max(0, Math.min(y - (item.height || 60) / 2, rect.height - (item.height || 60))),
        id: `${item.id}_${Date.now()}`,
        zIndex: placedStickers.length + 1,
      };

      console.log("Final sticker object:", newSticker);
      onDrop(newSticker);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      id="sticker-canvas"
      className={`relative w-full h-96 border-2 border-dashed rounded-lg overflow-hidden ${
        isOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
      }`}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className="absolute inset-4 bg-black rounded-2xl p-2">
        <div
          ref={drop}
          className="h-full rounded-xl bg-white/10 backdrop-blur-sm relative overflow-hidden"
        >
          {/* Profile placeholders */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white/20 rounded-full"></div>
          <div className="absolute top-32 left-4 right-4 h-8 bg-white/20 rounded"></div>
          <div className="absolute top-44 left-4 right-4 space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-white/20 rounded-lg"></div>
            ))}
          </div>

          {/* Stickers render in same coordinate space */}
          {placedStickers.map(sticker => (
            <DraggableSticker
              key={sticker.id}
              sticker={sticker}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      </div>

      {placedStickers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">🎨</div>
            <p>Drag stickers here to place them</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StickerSidebar({ selectedCategory, onCategoryChange, onStickerSelect }) {
  const filteredStickers = selectedCategory
    ? stickers.filter(s => s.category === selectedCategory)
    : stickers;

  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Sticker Library</h2>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              !selectedCategory ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap flex items-center space-x-1 ${
                selectedCategory === category.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stickers Grid */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {filteredStickers.map((sticker) => (
            <div
              key={sticker.id}
              className="cursor-pointer p-2 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
              onClick={() => onStickerSelect(sticker)}
            >
              <img
                src={sticker.src}
                alt={sticker.name}
                className="w-full h-12 object-contain mb-1"
              />
              <p className="text-xs text-center text-gray-600 truncate">{sticker.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Stickers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placedStickers, setPlacedStickers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Load stickers from Firebase
  useEffect(() => {
    if (user) {
      const loadStickers = async () => {
        try {
          const profileDoc = await getDoc(doc(db, "users", user.uid, "profile", "data"));
          if (profileDoc.exists()) {
            const data = profileDoc.data();
            setPlacedStickers(data.stickers || []);
          }
        } catch (error) {
          console.error('Error loading stickers:', error);
        }
      };
      loadStickers();
    }
  }, [user]);

  const handleDrop = (sticker) => {
    console.log('handleDrop called with:', sticker);
    console.log('Current placed stickers:', placedStickers);
    setPlacedStickers(prev => {
      const newStickers = [...prev, sticker];
      console.log('New placed stickers:', newStickers);
      return newStickers;
    });
  };

  const handleDelete = (stickerId) => {
    console.log('Deleting sticker:', stickerId);
    setPlacedStickers(prev => prev.filter(s => s.id !== stickerId));
  };

  const handleUpdate = (stickerId, updates) => {
    console.log('Updating sticker:', stickerId, 'with:', updates);
    setPlacedStickers(prev =>
      prev.map(s => s.id === stickerId ? { ...s, ...updates } : s)
    );
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save stickers');
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid, "profile", "data"), {
        stickers: placedStickers
      }, { merge: true });
      toast.success('Stickers saved successfully!');
    } catch (error) {
      console.error('Error saving stickers:', error);
      toast.error('Failed to save stickers');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sticker Sidebar */}
        <StickerSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onStickerSelect={() => {}} // Handled by drag
        />

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/Customize')}
                  className="text-sm flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Customize</span>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Add Stickers</h1>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Stickers</span>
                </button>
                <button
                  onClick={() => setPlacedStickers([])}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">How to use stickers:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Drag stickers from the sidebar onto the phone preview</li>
                <li>• Click and drag placed stickers to reposition them</li>
                <li>• Use the resize handles to change sticker size</li>
                <li>• Click the rotate button to rotate stickers</li>
                <li>• Click the trash button to delete stickers</li>
              </ul>
            </div>

            {/* Canvas */}
            <StickerCanvas
              placedStickers={placedStickers}
              onDrop={handleDrop}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />

            {/* Sticker Count */}
            <div className="mt-4 text-sm text-gray-600">
              {placedStickers.length} sticker{placedStickers.length !== 1 ? 's' : ''} placed
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
