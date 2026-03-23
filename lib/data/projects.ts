export type Project = {
  slug: string;
  title: string;
  description: string;
  desktopImage?: string;
  mobileImage: string;
  url: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "kratisix",
    title: "Kratisix",
    description: "Platform for online appointment booking",
    desktopImage: "/projects/kratisix-desktop.png",
    mobileImage: "/projects/kratisix-mobile.png",
    url: "https://www.kratisix.com/en",
  },
  {
    slug: "salsa-rayo",
    title: "Salsa Rayo",
    description: "Website for salsa and bachata classes",
    desktopImage: "/projects/salsa-rayo-desktop.png",
    mobileImage: "/projects/salsa-rayo-mobile.png",
    url: "https://salsarayo.com/",
  },
  {
    slug: "poseidon-transfers",
    title: "Poseidon Transfers",
    description: "Website for luxury transfers in Greece",
    desktopImage: "/projects/poseidon-transfers-desktop.png",
    mobileImage: "/projects/poseidon-transfers-mobile.png",
    url: "https://poseidontranfer.vercel.app/en-US",
  },
  {
    slug: "moisis-flower-design",
    title: "MOISIS Flower Design",
    description: "Website for a luxury florist in Ilioupoli",
    desktopImage: "/projects/moisis-flower-design-desktop.png",
    mobileImage: "/projects/moisis-flower-design-mobile.png",
    url: "https://www.moisis-flower-design.gr",
  },
  {
    slug: "1-percent-club",
    title: "1 Percent Club",
    description: "Game for progressive difficulty trivia",
    desktopImage: "/projects/1-percent-club-desktop.png",
    mobileImage: "/projects/1-percent-club-mobile.png",
    url: "https://1-percent-club-six.vercel.app/en",
  },
  {
    slug: "4yournails",
    title: "4 Your Nails",
    description: "Website for an award-winning nail care salon",
    desktopImage: "/projects/4yournails-desktop.png",
    mobileImage: "/projects/4yournails-mobile.png",
    url: "https://4yournails.vercel.app/el",
  },
  {
    slug: "iatriki-apokatastasi",
    title: "Iatriki Apokatastasi",
    description: "Website for medical rehabilitation services",
    desktopImage: "/projects/iatriki-apokatastasi-desktop.png",
    mobileImage: "/projects/iatriki-apokatastasi-mobile.png",
    url: "https://www.iatriki-apokatastasi.gr",
  },
  {
    slug: "anthopolio-kaloudhs",
    title: "Anthopolio Kaloudhs",
    description: "Website for a flower shop and garden services",
    desktopImage: "/projects/anthopolio-kaloudhs-desktop.png",
    mobileImage: "/projects/anthopolio-kaloudhs-mobile.png",
    url: "https://anthopolio-kaloudhs.vercel.app",
  },
  {
    slug: "iching-balance",
    title: "I Ching: Balance Way",
    description: "Website for holistic Chinese medicine therapies",
    desktopImage: "/projects/iching-balance-desktop.png",
    mobileImage: "/projects/iching-balance-mobile.png",
    url: "https://i-ching-v2.vercel.app/",
  },
  {
    slug: "figata",
    title: "Figata",
    description: "Website for a Greek fig cafe",
    desktopImage: "/projects/figata-desktop.png",
    mobileImage: "/projects/figata-mobile.png",
    url: "https://www.figata.gr/en",
  },
  {
    slug: "odontiatros-kiamos",
    title: "Odontiatros Giannis Kiamos",
    description: "Website for a dental surgery practice",
    desktopImage: "/projects/odontiatros-kiamos-desktop.png",
    mobileImage: "/projects/odontiatros-kiamos-mobile.png",
    url: "https://odontiatros-giannis-kiamos.vercel.app/",
  },
  {
    slug: "epityxein",
    title: "Epityxein",
    description: "Website for a tutoring center in Ilioupoli",
    desktopImage: "/projects/epityxein-desktop.png",
    mobileImage: "/projects/epityxein-mobile.png",
    url: "https://epityxein.vercel.app",
  },
];
