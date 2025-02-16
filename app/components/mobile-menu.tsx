"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, CreditCard, Home, PieChart, Plus, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Despesas", href: "/despesas", icon: CreditCard },
  { name: "Cartões", href: "/cartoes", icon: CreditCard },
  { name: "Relatórios", href: "/relatorios", icon: PieChart },
  { name: "Metas", href: "/metas", icon: Target },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40 lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Fechar menu</span>
            </Button>
          </div>
          <nav className="flex-grow">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center py-2 px-4 rounded-md",
                      pathname === item.href
                        ? "bg-gray-100 text-primary dark:bg-gray-700 dark:text-white"
                        : "text-gray-700 hover:bg-gray-50 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto pb-6">
            <Button asChild className="w-full mb-4" onClick={() => setOpen(false)}>
              <Link href="/adicionar-despesa">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Despesa
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

