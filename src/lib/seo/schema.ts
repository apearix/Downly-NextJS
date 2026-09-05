export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://downly.net";

export const FAQ_ITEMS = [
  {
    question: "What video resolutions and formats can I download?",
    answer:
      "Downly supports full native video quality up to 4K Ultra HD (2160p), 1440p 2K, 1080p Full HD, 720p HD, 480p, and 360p in MP4 format. Available resolutions are automatically detected from the source video to provide the highest fidelity possible.",
  },
  {
    question: "How do I extract high-quality MP3 audio from a video?",
    answer:
      "Paste any valid YouTube URL into Downly, switch the format toggle to 'Audio (MP3)', and click 'Download'. Downly automatically extracts the highest-bitrate audio track and packages it into a standard, universal 320kbps MP3 file.",
  },
  {
    question: "Is Downly free and does it require software installation?",
    answer:
      "Yes, Downly is 100% free and completely web-based. There is no software to install, no browser extension required, no registration or account needed, and no deceptive popup ads.",
  },
  {
    question: "Can I download videos on mobile devices (iPhone, iPad, and Android)?",
    answer:
      "Yes. Downly is built with a responsive mobile-first architecture that works directly inside mobile browsers including Safari on iOS/iPadOS and Google Chrome on Android. Downloaded media saves directly to your device's files or gallery.",
  },
  {
    question: "Does Downly throttle download speeds or limit file sizes?",
    answer:
      "No. Downly utilizes dedicated high-throughput processing pipelines to extract and merge video and audio streams at maximum speed. There are no artificial bandwidth caps or download speed throttles.",
  },
  {
    question: "What platforms are supported by Downly?",
    answer:
      "Downly currently features deep support for YouTube videos, shorts, and music URLs, with additional support for Instagram, TikTok, and Twitter/X media links currently in active rollout.",
  },
];

export function getSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${SITE_URL}/#application`,
    name: "Downly",
    alternateName: "Downly Media Downloader",
    url: SITE_URL,
    description:
      "Fast, privacy-focused online media downloader. Extract high-definition MP4 video (1080p, 2K, 4K) and high-bitrate MP3 audio with zero ads and zero bloat.",
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Video & Audio Downloader",
    operatingSystem: "All (Web Browser, Windows, macOS, Linux, iOS, Android)",
    browserRequirements: "Requires HTML5 compatible browser with JavaScript enabled",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "YouTube Video Downloader (144p to 4K Ultra HD MP4)",
      "YouTube Audio to MP3 320kbps Converter",
      "Dynamic Resolution Detection",
      "Real-Time Stream Progress Tracking",
      "Zero Popups & Zero Redirects",
      "Mobile Responsive Web App",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "2840",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Downly",
    alternateName: "Downly Downloader",
    url: SITE_URL,
    description:
      "Free online video and audio downloader. Download YouTube videos in 1080p/4K MP4 and extract HQ MP3 audio with instant processing.",
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?url={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Downly",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      caption: "Downly - Fast Media Downloader",
    },
    sameAs: [],
  };
}

export function getHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${SITE_URL}/#howto`,
    name: "How to Download YouTube Video or Audio with Downly",
    description:
      "Follow these three simple steps to download online video or audio to your device in highest quality.",
    totalTime: "PT30S",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Copy and Paste URL",
        text: "Copy the web address of the YouTube video or audio track and paste it into the Downly input bar.",
        url: `${SITE_URL}/#download`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Select Format and Resolution",
        text: "Choose between Video (MP4) or Audio (MP3), then pick your desired resolution from 360p up to 4K Ultra HD.",
        url: `${SITE_URL}/#download`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Download to Your Device",
        text: "Click the Download button. Downly fetches, merges, and streams the media file directly to your device storage.",
        url: `${SITE_URL}/#download`,
      },
    ],
  };
}

export function getFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
