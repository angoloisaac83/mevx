import Link from "next/link"
import { Twitter, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#0e0e16] border-t border-gray-800 py-8 px-4 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="text-xl font-bold text-[#6366f1] mb-2">MEVX</div>
            <p className="text-sm text-gray-400 mb-4">
              The ultimate platform for cryptocurrency trading and token sniping across multiple blockchains.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#6366f1]"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#6366f1]"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/discover" className="text-sm text-gray-400 hover:text-white">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/sniper" className="text-sm text-gray-400 hover:text-white">
                  Sniper
                </Link>
              </li>
              <li>
                <Link href="/earn" className="text-sm text-gray-400 hover:text-white">
                  Earn
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-sm text-gray-400 hover:text-white">
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Risk Disclosure
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MEVX. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-xs text-gray-500 hover:text-white">
              Disclaimer
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-white">
              Cookies
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-white">
              Sitemap
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            MEVX is not a financial advisor. Trading cryptocurrencies involves risk. Always do your own research.
          </p>
        </div>
      </div>
    </footer>
  )
}
