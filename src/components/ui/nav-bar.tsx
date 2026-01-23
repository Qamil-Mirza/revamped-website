"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import logo from "@/public/logo.png"
import Image from "next/image"

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Challenges", href: "/challenges" },
  { label: "Projects", href: "/projects" },
  { label: "Sidequests", href: "/sidequests" },
  { label: "Contact", href: "/contact" },
]

export function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mobileMenuOpen])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [mobileMenuOpen])

  return (
    <div className="sticky top-0 z-50 bg-backgroundColor px-4 py-2 dark:bg-backgroundDark shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Image
              src={logo}
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-lg font-bold text-primaryText dark:text-white">
              Qamil Mirza
            </span>
          </div>
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-primaryText/80 transition-colors hover:text-primaryText dark:text-white/80 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button - positioned to the right on mobile */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-primaryText dark:text-white" />
          ) : (
            <Menu className="h-6 w-6 text-primaryText dark:text-white" />
          )}
        </button>
      </div>

      {/* Mobile navigation with transition */}
      <div
        className={cn(
          "fixed inset-0 top-[4rem] z-40 bg-backgroundColor dark:bg-backgroundDark md:hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none",
        )}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col items-center space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="w-full text-center py-3 text-lg font-medium text-primaryText dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}