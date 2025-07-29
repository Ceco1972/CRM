"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, X } from "lucide-react"

export interface Toast {
  id: string
  type: "success" | "error"
  message: string
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, 5000)

    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  return (
    <div
      className={`
      flex items-center gap-3 p-4 rounded-lg shadow-lg border max-w-sm
      ${
        toast.type === "success"
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800"
      }
    `}
    >
      {toast.type === "success" ? (
        <CheckCircle className="h-5 w-5 text-green-600" />
      ) : (
        <XCircle className="h-5 w-5 text-red-600" />
      )}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-gray-400 hover:text-gray-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (type: "success" | "error", message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, type, message }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess: (message: string) => addToast("success", message),
    showError: (message: string) => addToast("error", message),
  }
}
