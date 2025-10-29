import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { db } from "../firebase"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore"

export function useLinks() {
    const { user } = useAuth()
    const [links, setLinks] = useState([])

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
    }

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

    return { links, addNewLink, toggleLink, deleteLink }
}
