"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/" },
    // { name: "Gallery", href: "/gallery" },
    { name: "Shared", href: "/shared" },
    { name: "Requests", href: "/requests" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="py-4 px-6">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MemoryVault
            </h1>
          </Link>

          {/* Center: Navigation (hidden on mobile) */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm transition-colors hover:text-blue-600 ${
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href))
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right: Wallet Connection + Mobile Menu */}
          <div className="flex items-center gap-4">
            <WalletConnectButton />

            {/* Mobile Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {navigation.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        href={item.href}
                        className={`w-full ${
                          pathname === item.href ||
                          (item.href !== "/" && pathname.startsWith(item.href))
                            ? "text-blue-600 font-semibold"
                            : "text-gray-600"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}