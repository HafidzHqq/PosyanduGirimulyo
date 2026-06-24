"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/pages";

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen pb-6">
      <header
        className="sticky left-0 right-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 px-3 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-4"
        ref={headerRef}
      >
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="flex min-w-0 flex-none items-center gap-3 rounded-xl pr-2 no-underline transition hover:opacity-90"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                <Image
                  alt="Logo Posyandu Girimulyo"
                  className="h-full w-full object-contain p-1"
                  height={44}
                  priority
                  src="/logo.webp"
                  width={44}
                />
              </div>
              <div className="min-w-0">
                <div className="truncate text-lg font-bold leading-tight text-ink sm:text-xl">Posyandu Girimulyo</div>
                <div className="hidden text-xs font-medium leading-tight text-slate-500 sm:block">Desa Girimulyo, Marga Sekampung</div>
              </div>
            </Link>

            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-primary shadow-sm transition hover:border-primary/30 hover:bg-primaryLight/30 focus:outline-none focus:ring-4 focus:ring-primary/15 lg:hidden"
              type="button"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              <span className="relative h-5 w-6">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-6 rounded-full bg-current transition ${
                    isMenuOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-2 h-0.5 w-6 rounded-full bg-current transition ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-4 h-0.5 w-6 rounded-full bg-current transition ${
                    isMenuOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>

          <nav
            className={`mt-3 lg:absolute lg:left-1/2 lg:top-1/2 lg:mt-0 lg:block lg:-translate-x-1/2 lg:-translate-y-1/2 ${
              isMenuOpen ? "block" : "hidden"
            }`}
            aria-label="Navigasi utama"
          >
            <ul className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-card lg:flex-row lg:items-center lg:rounded-full lg:bg-slate-100/80 lg:p-1 lg:shadow-none">
              {navItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                const isPrimary = item.href === "/kalkulator";
                return (
                  <li className={isPrimary ? "lg:hidden" : ""} key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold no-underline transition focus:outline-none focus:ring-4 focus:ring-primary/15 lg:rounded-full lg:px-3.5 lg:py-2 ${
                        isActive
                          ? "bg-primary text-white shadow-sm"
                          : isPrimary
                            ? "text-primary hover:bg-white hover:text-primary hover:shadow-sm"
                            : "text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href="/kalkulator"
            className={`absolute right-0 top-1/2 hidden -translate-y-1/2 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold no-underline shadow-sm transition hover:-translate-y-[55%] focus:outline-none focus:ring-4 focus:ring-primary/20 lg:inline-flex ${
              pathname.startsWith("/kalkulator")
                ? "bg-primaryDark text-white"
                : "bg-primary text-white hover:bg-primaryDark"
            }`}
          >
            <i className="fa-solid fa-calculator" aria-hidden="true" />
            Hitung Gizi
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-3 sm:px-4">{children}</div>

      <footer className="mx-auto mt-10 max-w-6xl px-4 pb-4 pt-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-sm text-slate-500 shadow-sm">
          <a className="font-medium text-slate-600 no-underline hover:text-primary" href="https://edu.pubmedia.id/index.php/jpa/article/view/220">
            &copy; 2026 Posyandu Girimulyo
          </a>
        </div>
      </footer>
    </div>
  );
}
