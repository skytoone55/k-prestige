'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface UserProfile {
  id: string
  email: string
}

interface AdminNavProps {
  user: UserProfile
}

export function AdminNav({ user }: AdminNavProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Image
          src="/K PRETIGE OR.png"
          alt="K PRESTIGE"
          width={120}
          height={40}
          className="h-10 w-auto"
        />
        <span className="text-sm text-gray-500">Administration</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user.email}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}
