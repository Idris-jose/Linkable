# TODO: Refactor Stickers and Preview Components

## Overview
Break down the large Stickers.jsx component into individual, maintainable components. Fix drag and drop issues for better usability. Clean up Preview.jsx by extracting sticker-related logic.

## Tasks
- [ ] Create src/components/Stickers/ directory
- [ ] Extract DraggableSticker component to src/components/Stickers/DraggableSticker.jsx
- [ ] Extract NewSticker component to src/components/Stickers/NewSticker.jsx
- [ ] Extract PreviewDropZone component to src/components/Stickers/PreviewDropZone.jsx
- [ ] Extract StickerControls component to src/components/Stickers/StickerControls.jsx
- [ ] Extract StickerSidebar component to src/components/Stickers/StickerSidebar.jsx
- [ ] Update Stickers.jsx to import and use the new components
- [ ] Fix drag and drop issues:
  - Ensure proper drop zone boundaries
  - Handle touch events for mobile
  - Prevent dragging during resize
  - Improve position calculation accuracy
- [ ] Clean up Preview.jsx:
  - Extract sticker rendering logic into a StickerOverlay component
  - Simplify the component structure
- [ ] Test the refactored components for functionality
- [ ] Update any necessary imports and dependencies
