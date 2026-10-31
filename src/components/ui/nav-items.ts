export interface NavItem {
  label: string
  href: string
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Challenges", href: "/challenges" },
  { label: "Projects", href: "/projects" },
  { label: "Research", href: "/research" },
  { label: "Sidequests", href: "/sidequests" },
  { label: "Contact", href: "/contact" },
]

// A section's link stays highlighted on its sub-pages; Home only on "/".
export function isActive(href: string, pathname: string | null): boolean {
  if (!pathname) return false
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

// Pages that use the light research theme.
export function isResearchPath(pathname: string | null): boolean {
  return isActive("/research", pathname)
}
