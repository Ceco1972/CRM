"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { resetPassword } from "@/lib/auth"
import { validateEmail } from "@/lib/validation"
import { ArrowLeft } from "lucide-react"

interface ResetPasswordFormProps {
  onSuccess: (message: string) => void
  onSwitchToLogin: () => void
  onError: (message: string) => void
}

export function ResetPasswordForm({ onSuccess, onSwitchToLogin, onError }: ResetPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    try {
      await resetPassword(email)
      onSuccess("Password reset email sent! Check your inbox for instructions.")
    } catch (error: any) {
      onError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (value: string) => {
    setEmail(value)
    if (error) {
      setError("")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <p className="text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Enter your email"
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Email"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
