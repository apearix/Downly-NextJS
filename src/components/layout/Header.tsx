"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X, ChevronRight } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "FAQ", href: "#faq" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Scroll detection for background toggle
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Active section spy
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id));
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );

    navLinks.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  // Body scroll lock on drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 h-20 z-[1000] transition-all duration-300 ${
          isScrolled
            ? "bg-[#F7F8F6]/85 backdrop-blur-md border-b border-[rgba(11,15,13,0.08)] shadow-xs"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-full max-w-7xl mx-auto px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" onClick={() => setActiveSection("home")} className="hover:opacity-90 transition">
            <Image src="/logo.png" alt="Downly - Fast & Free Media Downloader" width={130} height={40} priority />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F1F3EE]/80 p-1.5 rounded-full border border-[rgba(11,15,13,0.06)]">
            {navLinks.map(({ name, href }) => {
              const active = activeSection === href.slice(1);
              return (
                <Link
                  key={name}
                  href={href}
                  onClick={() => setActiveSection(href.slice(1))}
                  className={`px-5 py-2 text-sm rounded-full transition-all duration-200 ${
                    active
                      ? "font-semibold text-[#0B0F0D] bg-white shadow-xs"
                      : "font-medium text-[#738079] hover:text-[#0B0F0D] hover:bg-black/5"
                  }`}
                >
                  {name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="#download"
              className="hidden sm:inline-flex items-center px-5 py-2.5 bg-[#0B0F0D] hover:bg-black text-sm text-[#B6FF00] font-semibold rounded-full shadow-sm hover:shadow-lg transition duration-200"
            >
              Start downloading
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open Menu"
              className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-xl bg-white border border-[rgba(11,15,13,0.08)] text-[#0B0F0D] hover:bg-[#F1F3EE]"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-[#0B0F0D]/40 backdrop-blur-xs z-[1050] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white z-[1100] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-[rgba(11,15,13,0.06)]">
          <span className="font-bold text-[#0B0F0D] text-lg">Menu</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close Menu"
            className="w-9 h-9 rounded-full bg-[#F7F8F6] flex items-center justify-center text-[#738079] hover:text-[#0B0F0D]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5 p-6 overflow-y-auto flex-1">
          {navLinks.map(({ name, href }) => {
            const active = activeSection === href.slice(1);
            return (
              <Link
                key={name}
                href={href}
                onClick={() => {
                  setActiveSection(href.slice(1));
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between text-base px-4 py-3 rounded-xl transition ${
                  active
                    ? "font-semibold text-[#0B0F0D] bg-[#F7F8F6] border border-[rgba(11,15,13,0.08)] shadow-2xs"
                    : "font-medium text-[#738079] hover:text-[#0B0F0D] hover:bg-[#F7F8F6]"
                }`}
              >
                <span>{name}</span>
                <ChevronRight className={`h-4 w-4 ${active ? "text-[#0B0F0D]" : "text-[#738079]/40"}`} />
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-[rgba(11,15,13,0.06)] bg-[#F7F8F6]/60">
          <Link
            href="#download"
            onClick={() => setIsOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0B0F0D] text-[#B6FF00] font-semibold text-sm rounded-xl hover:bg-black transition group"
          >
            <span>Start downloading</span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </aside>
    </>
  );
}