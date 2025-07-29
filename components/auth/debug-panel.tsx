"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/firebase"

export function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<string>("")

  const checkFirebaseConnection = () => {
    const info = [
      `Firebase Auth: ${auth ? "Connected" : "Not connected"}`,
      `Auth Domain: ${auth?.config?.authDomain || "Not available"}`,
      `Project ID: ${auth?.config?.projectId || "Not available"}`,
      `API Key: ${auth?.config?.apiKey ? "Present" : "Missing"}`,
      `Current User: ${auth?.currentUser?.email || "None"}`,
      `Browser: ${navigator.userAgent}`,
      `Timestamp: ${new Date().toISOString()}`,
    ].join("\n")

    setDebugInfo(info)
    console.log("Firebase Debug Info:", info)
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkFirebaseConnection} variant="outline" className="w-full bg-transparent">
          Check Firebase Connection
        </Button>
        {debugInfo && <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">{debugInfo}</pre>}
      </CardContent>
    </Card>
  )
}
