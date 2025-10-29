import Link from "next/link";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">MemoryVault</h3>
            <p className="text-gray-600">Encrypted photos on Solana</p>
            <p className="text-sm text-gray-600">
              © {currentYear} MemoryVault. All rights reserved.
            </p>
          </div>

          {/* Column 2: Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#about"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#docs"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/Sanesomehow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Solana Badge */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">◎</span>
              <span className="text-sm font-medium text-gray-900">
                Built with Solana
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}