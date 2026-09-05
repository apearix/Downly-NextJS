import { FAQ_ITEMS } from "@/lib/seo/schema";
import { HelpCircle } from "lucide-react";

export function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-t border-border bg-surface py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Knowledge Base
          </p>
          <h2
            id="faq-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-heading sm:text-4xl"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-body text-sm sm:text-base">
            Everything you need to know about high-speed video downloads, audio conversion, and supported formats.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FAQ_ITEMS.map((item, idx) => (
            <article
              key={idx}
              className="group flex flex-col justify-between rounded-3xl border border-border bg-background p-7 transition-all duration-200 hover:-translate-y-1 hover:border-border-accent hover:shadow-[0_12px_36px_rgba(0,0,0,0.04)]"
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-[#0B0F0D]">
                    <HelpCircle className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Question 0{idx + 1}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold leading-snug text-heading">
                  {item.question}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-body">
                  {item.answer}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
