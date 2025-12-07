import { useDrag, useDrop } from 'react-dnd'
import { useRef } from 'react'
import { Edit, Trash2 } from "lucide-react"

const ItemType = 'LINK'

export default function SortableLinkItem({ link, index, moveLink, onDrop, onToggle, onEdit, onDelete }) {
    const ref = useRef(null)

    const [{ handlerId }, drop] = useDrop({
        accept: ItemType,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            moveLink(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
        drop(item) {
            onDrop() // Trigger persistence on drop
        }
    })

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: () => {
            return { id: link.id, index }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const opacity = isDragging ? 0 : 1
    drag(drop(ref))

    return (
        <div ref={ref} style={{ opacity }} data-handler-id={handlerId} className="bg-white p-4 rounded-xl shadow-sm mb-3 group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Drag Handle */}
                    <div className="text-gray-400 cursor-move">
                        <svg width="12" height="20" viewBox="0 0 12 20" fill="currentColor">
                            <circle cx="4" cy="4" r="2" />
                            <circle cx="4" cy="10" r="2" />
                            <circle cx="4" cy="16" r="2" />
                            <circle cx="8" cy="4" r="2" />
                            <circle cx="8" cy="10" r="2" />
                            <circle cx="8" cy="16" r="2" />
                        </svg>
                    </div>

                    {/* Link Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                            <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">{link.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${link.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                                }`}>
                                {link.status}
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm mt-1 truncate">{link.url}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={link.active}
                            onChange={() => onToggle(link.id)}
                            className="sr-only peer"
                        />
                        <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${link.active ? 'bg-blue-600' : 'bg-gray-300'
                            }`}>
                            <div className={`absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${link.active ? 'translate-x-5 border-blue-600' : 'translate-x-0'
                                }`}></div>
                        </div>
                    </label>

                    {/* Edit Button */}
                    <button
                        onClick={() => onEdit(link)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={16} />
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => onDelete(link.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
