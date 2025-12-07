import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import AddLink from "../modals/AddLink"
import { useLinks } from "../hooks/useLinks"
import EditLink from "../modals/EditLink"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import SortableLinkItem from "../components/SortableLinkItem"
import { useCallback } from "react"


export default function MyLinks() {
    const { links, addNewLink, toggleLink, deleteLink, UpdateLink, updateLocalLinks, saveLinksOrder } = useLinks()
    const [showAddLinkModal, setShowAddLinkModal] = useState(false);
    const [showEditLinkModal, setShowEditLinkModal] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);

    const moveLink = useCallback((dragIndex, hoverIndex) => {
        const dragLink = links[dragIndex]
        const newLinks = [...links]
        newLinks.splice(dragIndex, 1)
        newLinks.splice(hoverIndex, 0, dragLink)
        updateLocalLinks(newLinks)
    }, [links, updateLocalLinks])

    const handleDrop = useCallback(() => {
        saveLinksOrder(links)
    }, [links, saveLinksOrder])

    const totalLinks = links.length
    const activeLinks = links.filter(link => link.active).length
    const inactiveLinks = totalLinks - activeLinks

    const linkStats = [
        { title: 'Total Links', number: totalLinks, color: 'text-gray-800' },
        { title: 'Active', number: activeLinks, color: 'text-green-600' },
        { title: 'Inactive', number: inactiveLinks, color: 'text-gray-500' }
    ]

    const handleEditClick = (link) => {
        setSelectedLink(link);
        setShowEditLinkModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-8 lg:px-40 py-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-display">My Links</h1>
                    <p className="text-gray-600">Manage and organize your links</p>
                </div>
                <button
                    onClick={() => setShowAddLinkModal(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 w-full sm:w-auto font-medium">
                    <Plus size={20} />
                    Add Link
                </button>
            </div>

            {showAddLinkModal && <AddLink onAdd={addNewLink} onCancel={() => setShowAddLinkModal(false)} />}


            {showEditLinkModal && selectedLink && (
                <EditLink
                    link={selectedLink}
                    onEdit={UpdateLink}
                    onCancel={() => setShowEditLinkModal(false)}
                />
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {linkStats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <div className={`text-3xl font-bold mb-2 ${stat.title === 'Active' ? 'text-green-600' :
                            stat.title === 'Inactive' ? 'text-gray-400' : 'text-gray-800'
                            }`}>
                            {stat.number}
                        </div>
                        <div className="text-gray-600 text-sm font-medium">
                            {stat.title}
                        </div>
                    </div>
                ))}
            </div>

            {/* Links List */}
            <DndProvider backend={HTML5Backend}>
                <div className="space-y-3">
                    {links.map((link, index) => (
                        <SortableLinkItem
                            key={link.id}
                            index={index}
                            link={link}
                            moveLink={moveLink}
                            onDrop={handleDrop}
                            onToggle={toggleLink}
                            onEdit={handleEditClick}
                            onDelete={deleteLink}
                        />
                    ))}
                </div>
            </DndProvider>
        </div>
    )
}
