"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../lib/utils"
import { Button } from "@/components/ui/button"
import { CreditCard, Home, PieChart, Plus, Target } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useModal } from "../contexts/ModalContext"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Despesas", href: "/despesas", icon: CreditCard },
  { name: "Cartões", href: "/cartoes", icon: CreditCard },
  { name: "Relatórios", href: "/relatorios", icon: PieChart },
  { name: "Metas", href: "/metas", icon: Target },
]

export function Sidebar() {
  const pathname = usePathname()
  const { openModal } = useModal()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finanças Pessoais</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        pathname === item.href
                          ? "bg-gray-50 text-primary dark:bg-gray-700 dark:text-white"
                          : "text-gray-700 hover:text-primary hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-auto">
              <Button className="w-full" onClick={() => openModal()}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Despesa
              </Button>
            </li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

