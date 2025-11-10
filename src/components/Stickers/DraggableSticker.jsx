import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import { Trash2, RotateCcw } from 'lucide-react';
import 'react-resizable/css/styles.css';

const ItemTypes = {
  STICKER: 'sticker'
};

export default function DraggableSticker({
  sticker,
  onDelete,
  onUpdate,
  onSelect,
  isSelected,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Handle dragging
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.STICKER,
      item: { ...sticker, isPlaced: true },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      canDrag: () => !isResizing, // disable drag while resizing
    }),
    [sticker, isResizing]
  );

  // Select sticker
  const handleSelect = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(sticker.id);
  };

  // Delete sticker
  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(sticker.id);
  };

  // Rotate sticker by 45°
  const handleRotate = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onUpdate(sticker.id, {
      rotation: ((sticker.rotation || 0) + 45) % 360,
    });
  };

  return (
    <div
      ref={preview}
      className={`pointer-events-auto select-none ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{
        position: "absolute",
        left: sticker.x || 0,
        top: sticker.y || 0,
        zIndex: 1000 + (sticker.zIndex || 1),
        touchAction: "none",
        width: sticker.width || 60,
        height: sticker.height || 60,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleSelect}
    >
      <div className="relative w-full h-full">
        <ResizableBox
          width={sticker.width || 60}
          height={sticker.height || 60}
          minConstraints={[30, 30]}
          maxConstraints={[200, 200]}
          onResizeStart={() => setIsResizing(true)}
          onResizeStop={(e, { size }) => {
            setIsResizing(false);
            onUpdate(sticker.id, { width: size.width, height: size.height });
          }}
          resizeHandles={["se"]}
          handle={<span className="absolute bottom-0 right-0 w-3 h-3 bg-indigo-500 cursor-se-resize rounded-full" />}
        >
          <div
            ref={drag}
            className={`w-full h-full cursor-move ${
              isSelected ? "ring-2 ring-indigo-500 ring-offset-1 rounded" : ""
            }`}
          >
            <img
              src={sticker.src}
              alt={sticker.name}
              className="w-full h-full object-contain pointer-events-none select-none"
              style={{
                transform: `rotate(${sticker.rotation || 0}deg)`,
                filter: isDragging ? "brightness(0.8)" : "none",
                transition: "transform 0.2s ease",
              }}
              draggable={false}
            />
          </div>
        </ResizableBox>

        {/* Floating Controls — rotate & delete */}
        {(isHovered || isSelected) && !isDragging && (
          <div
            className="absolute inset-0"
            style={{
              zIndex: 10001,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
              title="Delete Sticker"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Rotate button */}
            <button
              onClick={handleRotate}
              className="absolute -top-3 -left-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
              title="Rotate 45°"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
