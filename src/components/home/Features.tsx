import { Zap, FileDown, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Conversion",
    description: "Cloud-native decoding engines ensure video streams and audio tracks render without throttling.",
    iconStyle: "bg-primary text-brand-black",
  },
  {
    icon: FileDown,
    title: "Universal Profiles",
    description: "Extract high-bitrate MP3s, crystal-clear 1080p, or raw 4K MP4s configured precisely for your storage needs.",
    iconStyle: "bg-brand-black text-primary",
  },
  {
    icon: Sparkles,
    title: "Zero Distractions",
    description: "No misleading redirect loops, invasive full-screen popups, or required software installations.",
    iconStyle: "bg-primary text-brand-black",
  },
];

export function Features() {
  return (
    <section id="features" className="border-y border-border bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Architecture
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-heading sm:text-4xl">
            Built for velocity. Minimal by design.
          </h2>
          <p className="mt-4 text-body">
            A utility platform engineered to extract media clean, safe, and direct.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group rounded-3xl border border-border bg-background p-8 transition duration-300 hover:-translate-y-1 hover:border-border-accent hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)]"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-105 ${item.iconStyle}`}>
                  <Icon className="h-5 w-5 stroke-[2.2]" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-heading">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-body">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}