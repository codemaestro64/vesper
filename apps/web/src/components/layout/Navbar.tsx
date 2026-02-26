import { NavLink } from "./NavLink"

const Navbar = () => {
  return (
    <header>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b px-4">
        <div className="max-w-6xl mx-auto ">
          <div className="flex items-center justify-between h-14 px-6">
            {/* Logo */}
            <a
              href="#"
              className="font-mono font-semibold text-lg gradient-text"
            >
              Vesper
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8">
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