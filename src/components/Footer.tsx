import Link from "next/link"
import { Github, Twitter, Wallet } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background/90 backdrop-blur-sm border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">MintMe</span>
            </Link>
            <p className="text-body-text max-w-md mb-6">
              The future of professional identity verification on the blockchain. Connect, verify, and mint your
              achievements.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-body-text hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-body-text hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-primary font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/app", label: "App" },
                { href: "/about", label: "About" },
                { href: "/profile", label: "Profile" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-body-text hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-primary font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {["Documentation", "Support", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-body-text hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 mt-8 pt-8 text-center">
          <p className="text-body-text">© {new Date().getFullYear()} MintMe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
