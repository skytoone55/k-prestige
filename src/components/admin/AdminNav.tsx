'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Hotel,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface UserProfile {
  id: string
  email: string
  role?: 'admin' | 'commercial'
}

interface AdminNavProps {
  user: UserProfile
}

interface NavItem {
  name: string
  href: string
  icon: any
  children?: { name: string; href: string }[]
}

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const supabase = createClient()

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Clients', href: '/admin/clients', icon: Users },
    { name: 'Chambres', href: '/admin/chambres', icon: Hotel },
    { name: 'Statistiques', href: '/admin/statistiques', icon: BarChart3 },
    { 
      name: 'Contenu', 
      href: '/admin/contenu', 
      icon: FileText,
      children: [
        { name: 'Accueil', href: '/admin/contenu' },
        { name: 'Pessah 2026', href: '/admin/contenu/pessah-2026' },
        { name: 'Tarifs', href: '/admin/contenu/tarifs' },
        { name: 'Contact', href: '/admin/contenu/contact' },
      ]
    },
    { name: 'Galerie Générale', href: '/admin/galerie-generale', icon: ImageIcon },
    { name: 'Galerie Catégories', href: '/admin/galerie', icon: ImageIcon },
    { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const toggleMenu = (menuName: string) => {
    const newExpanded = new Set(expandedMenus)
    if (newExpanded.has(menuName)) {
      newExpanded.delete(menuName)
    } else {
      newExpanded.add(menuName)
    }
    setExpandedMenus(newExpanded)
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname?.startsWith(href)
  }

  const isChildActive = (item: NavItem) => {
    if (!item.children) return false
    return item.children.some(child => pathname === child.href)
  }

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedMenus.has(item.name)
    const active = isActive(item.href) || isChildActive(item)

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMenu(item.name)}
            className={cn(
              'flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-secondary'
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-8 mt-2 space-y-1">
              {item.children!.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    'block px-4 py-2 rounded-lg text-sm transition-colors',
                    pathname === child.href
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-secondary'
                  )}
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
          active
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-secondary'
        )}
      >
        <Icon className="w-5 h-5" />
        <span>{item.name}</span>
      </Link>
    )
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-between p-4 bg-card border-b">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="K PRESTIGE"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="font-bold">K PRESTIGE</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-300 lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full pt-16 lg:pt-0">
          {/* Logo */}
          <div className="p-6 border-b hidden lg:block">
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="K PRESTIGE"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-xs text-muted-foreground mt-2">Administration</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map(renderNavItem)}
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t">
            <div className="mb-4">
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {user.role || 'Admin'}
              </p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
