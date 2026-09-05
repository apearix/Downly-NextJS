import Link from "next/link";
import { ArrowDown } from "lucide-react";

export function CTA() {
  return (
    <section className="px-6 pb-24 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-brand-black px-6 py-16 text-center sm:px-12 sm:py-20 shadow-2xl">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to pull down your media?
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/50 sm:text-base">
            Paste any link at the top and experience high-speed media processing with zero bloat.
          </p>
          <Link
            href="#download"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-brand-black transition duration-150 hover:bg-primary-light hover:shadow-[0_8px_25px_rgba(182,255,0,0.3)]"
          >
            Start downloading
            <ArrowDown className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </section>
  );
}