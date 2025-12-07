import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { db } from "../firebase"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, writeBatch, onSnapshot } from "firebase/firestore"
import toast from "react-hot-toast"

export function useLinks() {
    const { user } = useAuth()
    const [links, setLinks] = useState([])

   

    useEffect(() => {
        if (!user) {
            setLinks([])
            return
        }

        const q = query(collection(db, "users", user.uid, "links"), orderBy("order", "asc"))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const linksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setLinks(linksData)
        }, (error) => {
            console.error("Error fetching links:", error)
        })

        return () => unsubscribe()
    }, [user])

    // Removed manual fetchLinks as onSnapshot handles it automatically
    const fetchLinks = () => { }

    const addNewLink = async (newLink) => {
        try {
            await addDoc(collection(db, "users", user.uid, "links"), {
                title: newLink.title,
                url: newLink.url,
                active: false,
                order: links.length
            })
            toast.success("Link added successfully")
            toast.success("Link added successfully")
            // fetchLinks() // Handled by onSnapshot
        } catch (error) {
            console.error("Error adding link:", error)
            toast.error("Failed to add link")
        }
    }

    const toggleLink = async (id) => {
        try {
            const link = links.find(l => l.id === id)
            await updateDoc(doc(db, "users", user.uid, "links", id), {
                active: !link.active,
                status: !link.active ? 'Active' : 'Inactive'
            })
            // fetchLinks() // Handled by onSnapshot
        } catch (error) {
            console.error("Error toggling link:", error)
        }
    }

    const deleteLink = async (id) => {
        try {
            await deleteDoc(doc(db, "users", user.uid, "links", id))
            // fetchLinks() // Handled by onSnapshot
            toast.success("Link deleted")
        } catch (error) {
            console.error("Error deleting link:", error)
            toast.error("Failed to delete link")
        }
    }

    const UpdateLink = async (id, updatedLink) => {
        try {
            await updateDoc(doc(db, "users", user.uid, "links", id), {
                title: updatedLink.title,
                link: updatedLink.url
            })
            // fetchLinks() // Handled by onSnapshot
            toast.success("Link updated")
        }
        catch (error) {
            console.error("Error updating link:", error)
            toast.error("Failed to update link")
        }
    }

    const updateLocalLinks = (newLinks) => {
        setLinks(newLinks)
    }

    const saveLinksOrder = async (newLinks) => {
        try {
            const batch = writeBatch(db)
            newLinks.forEach((link, index) => {
                const linkRef = doc(db, "users", user.uid, "links", link.id)
                batch.update(linkRef, { order: index })
            })
            await batch.commit()
            // toast.success("Order saved") // Optional: maybe too noisy
        } catch (error) {
            console.error("Error reordering links:", error)
            toast.error("Failed to save order")
            // fetchLinks() // Handled by onSnapshot
        }
    }

    return { links, addNewLink, toggleLink, deleteLink, UpdateLink, updateLocalLinks, saveLinksOrder }
}
