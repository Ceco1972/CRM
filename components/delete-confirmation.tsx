"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Client } from "@/lib/types"

interface DeleteConfirmationProps {
  client: Client | null
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function DeleteConfirmation({
  client,
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteConfirmationProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Client</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{client?.name}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
