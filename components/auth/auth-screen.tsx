"use client"

import { useState } from "react"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { ResetPasswordForm } from "./reset-password-form"
import { DebugPanel } from "./debug-panel"
import { ToastContainer, useToast } from "@/components/toast"

type AuthView = "login" | "register" | "reset"

export function AuthScreen() {
  const [currentView, setCurrentView] = useState<AuthView>("login")
  const [showDebug, setShowDebug] = useState(false)
  const { toasts, removeToast, showSuccess, showError } = useToast()

  const handleSuccess = (message?: string) => {
    if (message) {
      showSuccess(message)
    }
    // The auth state change will be handled by the AuthProvider
  }

  const handleError = (message: string) => {
    showError(message)
    console.error("Auth error:", message)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        {currentView === "login" && (
          <LoginForm
            onSuccess={() => handleSuccess()}
            onSwitchToRegister={() => setCurrentView("register")}
            onSwitchToReset={() => setCurrentView("reset")}
            onError={handleError}
          />
        )}

        {currentView === "register" && (
          <RegisterForm
            onSuccess={() => handleSuccess("Account created successfully! Welcome to CRM.")}
            onSwitchToLogin={() => setCurrentView("login")}
            onError={handleError}
          />
        )}

        {currentView === "reset" && (
          <ResetPasswordForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setCurrentView("login")}
            onError={handleError}
          />
        )}

        {/* Debug toggle button */}
        <div className="text-center">
          <button onClick={() => setShowDebug(!showDebug)} className="text-xs text-gray-500 hover:text-gray-700">
            {showDebug ? "Hide" : "Show"} Debug Info
          </button>
        </div>

        {showDebug && <DebugPanel />}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
