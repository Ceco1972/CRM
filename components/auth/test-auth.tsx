"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn, createAccount } from "@/lib/auth"

export function TestAuth() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("test123")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const testSignIn = async () => {
    setLoading(true)
    setResult("")
    try {
      const user = await signIn(email, password)
      setResult(`✅ Sign in successful! User ID: ${user.uid}`)
    } catch (error: any) {
      setResult(`❌ Sign in failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testCreateAccount = async () => {
    setLoading(true)
    setResult("")
    try {
      const user = await createAccount(email, password)
      setResult(`✅ Account created! User ID: ${user.uid}`)
    } catch (error: any) {
      setResult(`❌ Account creation failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Authentication</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={testCreateAccount} disabled={loading} variant="outline">
            Create Account
          </Button>
          <Button onClick={testSignIn} disabled={loading}>
            Sign In
          </Button>
        </div>
        {result && <div className="p-3 bg-gray-100 rounded text-sm">{result}</div>}
      </CardContent>
    </Card>
  )
}
