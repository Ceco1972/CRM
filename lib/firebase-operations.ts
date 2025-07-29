import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Client, ClientFormData } from "./types"

export const addClient = async (clientData: ClientFormData): Promise<void> => {
  try {
    await addDoc(collection(db, "clients"), {
      ...clientData,
      createdAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error adding client:", error)
    throw new Error("Failed to add client")
  }
}

export const updateClient = async (id: string, clientData: ClientFormData): Promise<void> => {
  try {
    const clientRef = doc(db, "clients", id)
    await updateDoc(clientRef, clientData)
  } catch (error) {
    console.error("Error updating client:", error)
    throw new Error("Failed to update client")
  }
}

export const deleteClient = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "clients", id))
  } catch (error) {
    console.error("Error deleting client:", error)
    throw new Error("Failed to delete client")
  }
}

export const subscribeToClients = (callback: (clients: Client[]) => void) => {
  const q = query(collection(db, "clients"), orderBy("createdAt", "desc"))

  return onSnapshot(
    q,
    (snapshot) => {
      const clients: Client[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        clients.push({
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          createdAt: data.createdAt.toDate(),
        })
      })
      callback(clients)
    },
    (error) => {
      console.error("Error fetching clients:", error)
    },
  )
}
