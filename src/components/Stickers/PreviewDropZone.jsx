import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Preview from '../../pages/Preview';
import DraggableSticker from './DraggableSticker';

const ItemTypes = {
  STICKER: 'sticker'
};

export default function PreviewDropZone({
  profile,
  placedStickers,
  onDrop,
  onDelete,
  onUpdate,
  onSelect,
  selectedStickerId,
  isOver
}) {
  const [contentRef, setContentRef] = useState(null);

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.STICKER,
    drop: (item, monitor) => {
      if (!contentRef) return;

      const offset = monitor.getClientOffset();
      if (!offset) return;

      const rect = contentRef.getBoundingClientRect();
      const dropX = offset.x - rect.left;
      const dropY = offset.y - rect.top;
      const width = item.width || 60;
      const height = item.height || 60;

      // Ensure sticker stays within bounds
      const updatedX = Math.max(0, Math.min(dropX - width / 2, rect.width - width));
      const updatedY = Math.max(0, Math.min(dropY - height / 2, rect.height - height));

      if (!item.isPlaced) {
        // New sticker
        const newSticker = {
          ...item,
          x: updatedX,
          y: updatedY,
          id: `${item.id}_${Date.now()}`,
          zIndex: placedStickers.length + 1,
          width,
          height,
          rotation: 0
        };
        onDrop(newSticker);
      } else {
        // Existing sticker - move to front
        const maxZ = placedStickers.length > 0
          ? Math.max(...placedStickers.map(s => s.zIndex || 0)) + 1
          : 1;
        onUpdate(item.id, { x: updatedX, y: updatedY, zIndex: maxZ });
      }
    },
    collect: (monitor) => ({
      canDrop: !!monitor.canDrop(),
    }),
  }), [contentRef, placedStickers, onDrop, onUpdate]);

  const overlayStickers = placedStickers.map(sticker => (
    <DraggableSticker
      key={sticker.id}
      sticker={sticker}
      onDelete={onDelete}
      onUpdate={onUpdate}
      onSelect={onSelect}
      isSelected={sticker.id === selectedStickerId}
    />
  ));

  return (
    <Preview
      profile={profile}
      isEditing={true}
      contentRef={(node) => {
        drop(node);
        setContentRef(node);
      }}
      isOver={isOver}
    >
      <div className="absolute inset-0 z-5">
        {overlayStickers}
      </div>
    </Preview>
  );
}
