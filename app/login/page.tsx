"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { FcGoogle } from "react-icons/fc"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  async function handleGoogleLogin() {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch {
      setError("Erro ao fazer login com Google")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-gray-600">Entre para acessar suas finanças</p>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
        
        <Button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2"
          disabled={loading}
          variant="outline"
        >
          <FcGoogle className="w-5 h-5" />
          {loading ? "Entrando..." : "Continuar com Google"}
        </Button>
      </div>
    </div>
  )
} 