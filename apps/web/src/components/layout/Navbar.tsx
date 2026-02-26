'use client'

import { useState } from "react"
import { NavLink } from "./NavLink"

const Navbar = () => {
  return (
    <header>
      <nav className="fixed top-0 left-0 right-0 z-50 my-4 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#"
              className="font-mono font-semibold text-lg gradient-text"
            >
              Vesper
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8 h-14 px-6 items-center">
              <NavLink
                href="/create"
                className="text-muted-foreground hover:text-foreground nav-link"
                activeClassName="text-foreground font-medium nav-link-active"
              >
                Create
              </NavLink>
            </div>

          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar