import { Plus, Edit, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import AddLink from "../modals/AddLink"
import { useAuth } from "../context/AuthContext"
import { db } from "../firebase"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore"


export default function MyLinks() {
    const { user } = useAuth()
    const [links, setLinks] = useState([])
    const [showAddLinkModal, setShowAddLinkModal] = useState(false);

    useEffect(() => {
        if (user) {
            fetchLinks()
        }
    }, [user])

    const fetchLinks = async () => {
        try {
            const linksSnapshot = await getDocs(collection(db, "users", user.uid, "links"))
            const linksData = linksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setLinks(linksData)
        } catch (error) {
            console.error("Error fetching links:", error)
        }
    }

    const addNewLink = async (newLink) => {
        try {
            await addDoc(collection(db, "users", user.uid, "links"), {
                title: newLink.title,
                url: newLink.url,
                active: false,
                status: "Inactive"
            })
            fetchLinks()
        } catch (error) {
            console.error("Error adding link:", error)
        }
    };

    const toggleLink = async (id) => {
        try {
            const link = links.find(l => l.id === id)
            await updateDoc(doc(db, "users", user.uid, "links", id), {
                active: !link.active,
                status: !link.active ? 'Active' : 'Inactive'
            })
            fetchLinks()
        } catch (error) {
            console.error("Error toggling link:", error)
        }
    }

    const deleteLink = async (id) => {
        try {
            await deleteDoc(doc(db, "users", user.uid, "links", id))
            fetchLinks()
        } catch (error) {
            console.error("Error deleting link:", error)
        }
    }

   const totalLinks = links.length
    const activeLinks = links.filter(link => link.active).length
    const inactiveLinks = totalLinks - activeLinks

    const linkStats = [
        { title: 'Total Links', number: totalLinks, color: 'text-gray-800' },
        { title: 'Active', number: activeLinks, color: 'text-green-600' },
        { title: 'Inactive', number: inactiveLinks, color: 'text-gray-500' }
    ]

    return (
        <div className="min-h-screen bg-gray-50 px-40 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Links</h1>
                    <p className="text-gray-600">Manage and organize your links</p>
                </div>
                <button
                onClick={() => setShowAddLinkModal(true)}
                className="bg-gradient-to-r from-blue-700 to-purple-500 via-blue-700 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus size={20} />
                    Add Link
                </button>
            </div>

            {showAddLinkModal && <AddLink onAdd={addNewLink} onCancel={() => setShowAddLinkModal(false)} />}

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                {linkStats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                        <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                            {stat.number}
                        </div>
                        <div className="text-gray-600 text-sm font-medium">
                            {stat.title}
                        </div>
                    </div>
                ))}
            </div>

            {/* Links List */}
            <div className="space-y-3">
                {links.map((link) => (
                    <div key={link.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Drag Handle */}
                                <div className="text-gray-400 cursor-move">
                                    <svg width="12" height="20" viewBox="0 0 12 20" fill="currentColor">
                                        <circle cx="4" cy="4" r="2"/>
                                        <circle cx="4" cy="10" r="2"/>
                                        <circle cx="4" cy="16" r="2"/>
                                        <circle cx="8" cy="4" r="2"/>
                                        <circle cx="8" cy="10" r="2"/>
                                        <circle cx="8" cy="16" r="2"/>
                                    </svg>
                                </div>

                                {/* Link Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-medium text-gray-900">{link.title}</h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            link.active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {link.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-1">{link.url}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                {/* Toggle Switch */}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={link.active}
                                        onChange={() => toggleLink(link.id)}
                                        className="sr-only peer"
                                    />
                                    <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                                        link.active ? 'bg-black' : 'bg-gray-300'
                                    }`}>
                                        <div className={`absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
                                            link.active ? 'translate-x-5 ' : 'translate-x-0'
                                        }`}></div>
                                    </div>
                                </label>

                                {/* Edit Button */}
                                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Edit size={16} />
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => deleteLink(link.id)}
                                    className="p-2  text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
