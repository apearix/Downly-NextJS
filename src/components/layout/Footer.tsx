import Link from "next/link"; 

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-center lg:px-8">

        

        {/* Links */}
        {/* <nav aria-label="Footer Navigation" className="flex items-center gap-5 text-xs font-medium text-black/60">
          <Link
            href="/privacy"
            className="transition-colors hover:text-black"
          >
            Privacy
          </Link>

          <Link
            href="/terms"
            className="transition-colors hover:text-black"
          >
            Terms
          </Link> 
        </nav> */}

        {/* Copyright */}
        <p className="text-xs text-black/35">
          © 2026 Downly. All rights reserved. Build with <span className="text-black">❤️</span> by{" "}
          <Link
            href="apearix.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors hover:text-primary text-black"
          >
            Apearix
          </Link>
          .
        </p>

      </div>
    </footer>
  );
}