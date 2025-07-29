"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Edit, Trash2, Download, Users } from "lucide-react"
import type { Client } from "@/lib/types"

interface ClientListProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
  onExport: () => void
  isLoading?: boolean
}

export function ClientList({ clients, onEdit, onDelete, onExport, isLoading = false }: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("createdAt")

  const filteredClients = clients
    .filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      }
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading clients...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with stats and actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Clients</h2>
          <Badge variant="secondary">{clients.length}</Badge>
        </div>
        <Button onClick={onExport} variant="outline" size="sm" disabled={clients.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Search and sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "createdAt")}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="createdAt">Sort by Date Added</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Client list */}
      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{searchTerm ? "No clients found" : "No clients yet"}</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "Add your first client to get started"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <h3 className="font-medium text-lg">{client.name}</h3>
                    <p className="text-muted-foreground">{client.email}</p>
                    <p className="text-muted-foreground">{client.phone}</p>
                    <p className="text-xs text-muted-foreground">Added {client.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(client)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(client)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
