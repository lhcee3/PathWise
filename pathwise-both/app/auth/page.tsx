"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"
import { supabase } from "@/lib/supabase"

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        router.push("/dashboard")
      }
    }
    checkUser()
  }, [router])

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">PathWise</h1>
          <p className="text-muted-foreground">Your journey to consistent progress</p>
        </div>
        <AuthForm mode={mode} onToggleMode={toggleMode} />
      </div>
    </div>
  )
}
