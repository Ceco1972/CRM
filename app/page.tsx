"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, LogOut } from "lucide-react"
import { ClientForm } from "@/components/client-form"
import { ClientList } from "@/components/client-list"
import { DeleteConfirmation } from "@/components/delete-confirmation"
import { ToastContainer, useToast } from "@/components/toast"
import { addClient, updateClient, deleteClient, subscribeToClients } from "@/lib/firebase-operations"
import { exportToCSV } from "@/lib/csv-export"
import { AuthProvider } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { signOutUser } from "@/lib/auth"
import { useAuth } from "@/contexts/auth-context"
import type { Client, ClientFormData } from "@/lib/types"

type View = "list" | "add" | "edit"

function CRMDashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [currentView, setCurrentView] = useState<View>("list")
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deletingClient, setDeletingClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { toasts, removeToast, showSuccess, showError } = useToast()

  const handleLogout = async () => {
    try {
      await signOutUser()
      showSuccess("Signed out successfully!")
    } catch (error) {
      showError("Failed to sign out")
    }
  }

  useEffect(() => {
    const unsubscribe = subscribeToClients((clientsData) => {
      setClients(clientsData)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleAddClient = async (data: ClientFormData) => {
    setIsSubmitting(true)
    try {
      await addClient(data)
      setCurrentView("list")
      showSuccess("Client added successfully!")
    } catch (error) {
      showError("Failed to add client. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateClient = async (data: ClientFormData) => {
    if (!editingClient) return

    setIsSubmitting(true)
    try {
      await updateClient(editingClient.id, data)
      setCurrentView("list")
      setEditingClient(null)
      showSuccess("Client updated successfully!")
    } catch (error) {
      showError("Failed to update client. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClient = async () => {
    if (!deletingClient) return

    setIsSubmitting(true)
    try {
      await deleteClient(deletingClient.id)
      setDeletingClient(null)
      showSuccess("Client deleted successfully!")
    } catch (error) {
      showError("Failed to delete client. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClick = (client: Client) => {
    setEditingClient(client)
    setCurrentView("edit")
  }

  const handleDeleteClick = (client: Client) => {
    setDeletingClient(client)
  }

  const handleExport = () => {
    try {
      exportToCSV(clients)
      showSuccess("Client list exported successfully!")
    } catch (error) {
      showError("Failed to export client list.")
    }
  }

  const handleCancel = () => {
    setCurrentView("list")
    setEditingClient(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.email} • Manage your client relationships</p>
            </div>
            <div className="flex items-center gap-3">
              {currentView === "list" && (
                <Button onClick={() => setCurrentView("add")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Client
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {currentView === "list" && (
            <ClientList
              clients={clients}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onExport={handleExport}
              isLoading={isLoading}
            />
          )}

          {currentView === "add" && (
            <div className="flex justify-center">
              <ClientForm onSubmit={handleAddClient} onCancel={handleCancel} isLoading={isSubmitting} />
            </div>
          )}

          {currentView === "edit" && editingClient && (
            <div className="flex justify-center">
              <ClientForm
                client={editingClient}
                onSubmit={handleUpdateClient}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmation
          client={deletingClient}
          isOpen={!!deletingClient}
          onConfirm={handleDeleteClient}
          onCancel={() => setDeletingClient(null)}
          isLoading={isSubmitting}
        />

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  )
}

export default function CRMApp() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <CRMDashboard />
      </ProtectedRoute>
    </AuthProvider>
  )
}
