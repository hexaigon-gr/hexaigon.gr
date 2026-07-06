"use client";

import { toPng } from "html-to-image";
import { QRCodeSVG } from "qrcode.react";
import { useCallback,useRef } from "react";

const SERVICES = [
  "Websites",
  "Mobile Apps",
  "E-shops",
  "AI Automation",
  "Digital Marketing",
  "SEO & AEO",
  "Custom Software",
  "Web Apps",
];

const HexagonIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <polygon
      points="50,3 93,28 93,72 50,97 7,72 7,28"
      fill="url(#hex-grad)"
    />
  </svg>
);

const HexagonIconBack = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient
        id="hex-grad-back"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <polygon
      points="50,3 93,28 93,72 50,97 7,72 7,28"
      fill="url(#hex-grad-back)"
    />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1={17.5} x2={17.51} y1={6.5} y2={6.5} />
  </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx={12} cy={12} r={10} />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width={20} height={16} x={2} y={4} rx={2} />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const download = (dataUrl: string, filename: string) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

export default function BusinessCardPage() {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const downloadCard = useCallback(
    async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
      if (!ref.current) return;
      // High-res: 4x scale for print quality (1344x768 at 384 DPI)
      const dataUrl = await toPng(ref.current, {
        pixelRatio: 4,
        cacheBust: true,
      });
      download(dataUrl, filename);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center gap-8 p-8 print:bg-white print:p-0 print:gap-4">
      <style>{`
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}</style>

      <p className="text-sm text-neutral-500 no-print">
        Standard business card: 3.5&quot; &times; 2&quot; (89mm &times; 51mm)
      </p>

      {/* FRONT */}
      <div
        ref={frontRef}
        className="relative overflow-hidden bg-[#0a0a0a] text-white shadow-2xl"
        style={{ width: "3.5in", height: "2in" }}
      >
        {/* Subtle glow accent */}
        <div className="absolute -left-16 -top-16 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="relative h-full grid grid-cols-[1.1fr_1fr] gap-3 p-5">
          {/* LEFT: Brand */}
          <div className="flex flex-col justify-between border-r border-white/10 pr-3">
            <div className="flex items-center gap-2">
              <HexagonIcon className="w-6 h-6" />
              <span className="text-lg font-bold tracking-tight leading-none">
                hex<span className="text-blue-500">AI</span>gon
              </span>
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-[0.2em] text-blue-400 font-semibold mb-1">
                AI Solutions
              </p>
              <p className="text-[9px] text-neutral-400 leading-snug">
                Web Development &amp;
                <br />
                Automation
              </p>
            </div>
          </div>

          {/* RIGHT: Contact */}
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <PhoneIcon className="w-2.5 h-2.5 text-blue-400" />
              </div>
              <span className="text-[8.5px] text-neutral-200 font-medium">
                +30 698 388 2720
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <MailIcon className="w-2.5 h-2.5 text-blue-400" />
              </div>
              <span className="text-[7px] text-neutral-200 whitespace-nowrap leading-tight">
                hexaigonsoftwaresolutions@gmail.com
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <GlobeIcon className="w-2.5 h-2.5 text-blue-400" />
              </div>
              <span className="text-[8.5px] text-neutral-200">
                hexaigon.gr
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <InstagramIcon className="w-2.5 h-2.5 text-blue-400" />
              </div>
              <span className="text-[8.5px] text-neutral-200">
                @hexaigon.gr
              </span>
            </div>
          </div>
        </div>

        {/* Blue accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500 via-blue-400 to-blue-700" />
      </div>

      <button
        onClick={() => downloadCard(frontRef, "hexaigon-card-front.png")}
        className="no-print px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
      >
        Download Front as PNG
      </button>

      {/* BACK */}
      <div
        ref={backRef}
        className="relative overflow-hidden bg-[#0a0a0a] text-white shadow-2xl"
        style={{ width: "3.5in", height: "2in" }}
      >
        {/* Subtle glow accent */}
        <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl" />

        <div className="relative h-full grid grid-cols-[1fr_auto] gap-3 p-5">
          {/* LEFT: brand + services */}
          <div className="flex flex-col min-w-0">
            {/* Brand */}
            <div className="flex items-center gap-2 mb-2">
              <HexagonIconBack className="w-4 h-4" />
              <span className="text-sm font-bold tracking-tight">
                hex<span className="text-blue-500">AI</span>gon
              </span>
            </div>

            {/* Label */}
            <p className="text-[7.5px] font-semibold text-blue-400 uppercase tracking-[0.25em] mb-1.5">
              What We Build
            </p>

            {/* Services grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 flex-1">
              {SERVICES.map((service) => (
                <div key={service} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-[8px] text-neutral-200 truncate">
                    {service}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: QR code */}
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="bg-white p-1.5 rounded-md">
              <QRCodeSVG
                value="https://hexaigon.gr"
                size={76}
                level="H"
                marginSize={0}
                fgColor="#0a0a0a"
                bgColor="#ffffff"
              />
            </div>
            <span className="text-[7px] text-neutral-400 uppercase tracking-[0.15em]">
              Scan Me
            </span>
          </div>
        </div>

        {/* Blue accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-700 via-blue-400 to-blue-500" />
      </div>

      <button
        onClick={() => downloadCard(backRef, "hexaigon-card-back.png")}
        className="no-print px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
      >
        Download Back as PNG
      </button>
    </div>
  );
}
