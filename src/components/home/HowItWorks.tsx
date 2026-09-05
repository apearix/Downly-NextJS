import { Video } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Paste URL string",
    description: "Grab the video or audio web address from any major platform and input it above.",
    invert: true,
  },
  {
    step: "02",
    title: "Select container & bitrate",
    description: "Choose your desired codec, container (MP4, MP3, WEBM), and video resolution.",
    invert: false,
  },
  {
    step: "03",
    title: "Stream direct to disk",
    description: "Instantaneous parsing with immediate pipe streaming directly to your local downloads folder.",
    invert: true,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted">
              Workflow
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-heading">
              Three operations. <span className="text-black/35">Zero fluff.</span>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-body">
              Engineered to minimize latency between spotting an asset and keeping it locally offline.
            </p>

            <div className="mt-10 space-y-8">
              {steps.map((item, idx) => (
                <div key={idx} className="flex gap-5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold tracking-wider ${
                      item.invert
                        ? "bg-brand-black text-primary"
                        : "bg-primary text-brand-black"
                    }`}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-heading">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-body">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[40px] bg-primary/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-brand-black p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Buffer inspector
                </span>
                <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold tracking-wide text-brand-black">
                  READY
                </span>
              </div>

              <div className="mt-6 rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-brand-black">
                    <Video className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      Sample_Video_Render.mp4
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      H.264 · 1080p60 · 24.8 MB
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-xs font-medium text-white/40">
                    <span>Processing Stream</span>
                    <span className="font-mono text-primary">82%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[82%] rounded-full bg-primary transition-all duration-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}