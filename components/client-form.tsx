"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { validateClientForm } from "@/lib/validation"
import type { Client, ClientFormData } from "@/lib/types"

interface ClientFormProps {
  client?: Client
  onSubmit: (data: ClientFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ClientForm({ client, onSubmit, onCancel, isLoading = false }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: client?.name || "",
    email: client?.email || "",
    phone: client?.phone || "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateClientForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    try {
      await onSubmit(formData)
      setErrors({})
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const handleChange = (field: keyof ClientFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{client ? "Edit Client" : "Add New Client"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter client name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email address"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Enter phone number"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : client ? "Update Client" : "Add Client"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
