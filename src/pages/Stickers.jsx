import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import PreviewDropZone from '../components/Stickers/PreviewDropZone';
import StickerControls from '../components/Stickers/StickerControls';
import StickerSidebar from '../components/Stickers/StickerSidebar';

export default function Stickers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placedStickers, setPlacedStickers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedStickerId, setSelectedStickerId] = useState(null);
  const [isOver, setIsOver] = useState(false);

  // Load profile and stickers from Firebase
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          const profileDoc = await getDoc(doc(db, "users", user.uid, "profile", "data"));
          if (profileDoc.exists()) {
            const data = profileDoc.data();
            setProfile(data);
            setPlacedStickers(data.stickers || []);
          }
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };
      loadData();
    }
  }, [user]);

  const handleDrop = (sticker) => {
    setPlacedStickers(prev => [...prev, sticker]);
  };

  const handleDelete = (stickerId) => {
    setPlacedStickers(prev => prev.filter(s => s.id !== stickerId));
    if (selectedStickerId === stickerId) {
      setSelectedStickerId(null);
    }
  };

  const handleUpdate = (stickerId, updates) => {
    setPlacedStickers(prev =>
      prev.map(s => s.id === stickerId ? { ...s, ...updates } : s)
    );
  };

  const handleSelect = (stickerId) => {
    setSelectedStickerId(stickerId);
  };

  const handleDeselect = () => {
    setSelectedStickerId(null);
  };

  const selectedSticker = placedStickers.find(s => s.id === selectedStickerId);

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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Create a copy of profile without stickers for editing
  const editProfile = { ...profile, stickers: undefined };

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sticker Sidebar */}
        <StickerSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Main Content - Full Preview */}
        <div className="flex-1 flex flex-col">
          {/* Fixed Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-50 shadow-sm">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/Customize')}
                className="text-sm flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Customize</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Add Stickers</h1>
              <span className="text-sm text-gray-500">
                {placedStickers.length} sticker{placedStickers.length !== 1 ? 's' : ''} placed
                {selectedStickerId && ` | Editing: ${selectedSticker?.name || ''}`}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setPlacedStickers([]);
                  setSelectedStickerId(null);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
              <button
                onClick={handleSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Stickers</span>
              </button>
            </div>
          </div>

          {/* Preview with Drop Zone */}
          <div className="flex-1 overflow-auto">
            <PreviewDropZone
              profile={editProfile}
              placedStickers={placedStickers}
              onDrop={handleDrop}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onSelect={handleSelect}
              selectedStickerId={selectedStickerId}
              isOver={isOver}
            />
          </div>

          {/* Controls Panel */}
          <StickerControls
            selectedSticker={selectedSticker}
            onUpdate={handleUpdate}
            onDeselect={handleDeselect}
          />
        </div>
      </div>
    </DndProvider>
  );
}
