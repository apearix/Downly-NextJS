"use client";
 

export function WhyDownloadApp() {
  return (
    <section
      id="home"
      aria-label="Media Downloader Hero"
      className="relative flex   items-center justify-center overflow-hidden bg-black py-40"
    >
      {/* Background Decorative Tech Grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
        style={{
          backgroundImage: "radial-gradient(rgba(11,15,13,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Atmospheric Ambient Glows */}
      <div className="pointer-events-none absolute left-1/2 top-12 -z-10 h-[550px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#B6FF00]/25 via-[#D7FF66]/15 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute -left-48 top-1/3 -z-10 h-72 w-72 rounded-full bg-[#B6FF00]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-48 top-1/4 -z-10 h-80 w-80 rounded-full bg-[#B6FF00]/10 blur-[110px]" />

      <div className="relative mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="mx-auto text-center">

          {/* Core Kinetic Headline */}
          <h1 className="text-4xl sm:text-6xl xl:text-8xl font-bold leading-[1.04] tracking-[-0.045em] text-[#0B0F0D]">
            <span className="text-white">Download Apk for</span>
            <br />
             {/* <span className="text-muted">App for</span> */}
             <span className="relative mx-auto mt-2 block w-fit">
              <span className="relative z-10 bg-gradient-to-r from-[#74da03] via-[#B6FF00] to-white bg-clip-text text-transparent">
                80% Faster Speed
              </span>
              <span className="absolute -bottom-1.5 left-0 right-0 -z-0 h-2.5 w-full -rotate-1 rounded-sm bg-[#B6FF00]/80" />
            </span>
          </h1>

           
        </div>

        {/* Full-width Honest Subheading */}
        <p className="mt-3 mx-auto max-w-4xl md:mt-10 w-full text-center text-sm md:text-xl leading-relaxed text-white/70">
          Web downloaders force video through crowded overseas proxy servers. The native Downly Android app executes Straight on your device silicon with uncapped line bandwidth.
        </p>
      </div>
    </section>
  );
}