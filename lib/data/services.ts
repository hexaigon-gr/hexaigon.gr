import {
  AppWindow,
  Bot,
  Code,
  Globe,
  type LucideIcon,
  Megaphone,
  Nfc,
  Search,
  ShoppingCart,
  Wrench,
} from "lucide-react";

import type { Localized } from "@/lib/i18n/localized";

/**
 * The service catalogue, and the source of every service landing page.
 *
 * Copy lives here rather than in `messages/*.json` because a service is a unit:
 * its slug, its H1, its meta description, its body and its FAQ have to move
 * together, and splitting them across two files is how one of them goes stale.
 * Section labels that are shared across pages stay in `messages/`.
 *
 * `slug` differs per locale on purpose. Greek buyers search Greek words, and the
 * URL is one of the few places left where an exact-match phrase still helps —
 * /el/services/kataskevi-eshop rather than /el/services/ecommerce-development.
 * `buildAlternatesFor` ties the two together with hreflang so Google treats them
 * as one page in two languages, not as two competing pages.
 */

export type ServiceFaq = {
  question: Localized<string>;
  answer: Localized<string>;
};

export type ServiceSection = {
  heading: Localized<string>;
  body: Localized<string>;
};

export type Service = {
  /** Stable id. Matches the `Services.*` message keys for the homepage grid. */
  key: string;
  icon: LucideIcon;
  slug: Localized<string>;
  h1: Localized<string>;
  /** `<title>`. The root layout appends " | hexAIgon", so leave the brand off. */
  metaTitle: Localized<string>;
  metaDescription: Localized<string>;
  /** Lead paragraph under the H1. Doubles as the card blurb on the hub page. */
  intro: Localized<string>;
  sections: ServiceSection[];
  deliverables: Localized<string[]>;
  faq: ServiceFaq[];
  /** Portfolio slugs shown as proof. Internal links, so keep them relevant. */
  projectSlugs: string[];
};

export const SERVICES: Service[] = [
  {
    key: "websites",
    icon: Globe,
    slug: { el: "kataskevi-istoselidon", en: "website-development" },
    h1: {
      el: "Κατασκευή Ιστοσελίδων",
      en: "Website Development",
    },
    metaTitle: {
      el: "Κατασκευή Ιστοσελίδων Αθήνα",
      en: "Website Development in Athens, Greece",
    },
    metaDescription: {
      el: "Κατασκευή επαγγελματικών ιστοσελίδων σε Next.js: ταχύτητα, mobile-first σχεδιασμός και τεχνικό SEO από την πρώτη μέρα. Δες έργα και ζήτα δωρεάν προσφορά.",
      en: "Custom websites built in Next.js: fast, mobile-first and search-ready from day one. See the work and ask for a free quote.",
    },
    intro: {
      el: "Φτιάχνουμε ιστοσελίδες που φορτώνουν ακαριαία, δείχνουν άψογες στο κινητό και φέρνουν τηλέφωνα — όχι απλώς επισκέψεις. Κάθε site γράφεται custom σε Next.js και React, χωρίς έτοιμα templates και χωρίς δεκάδες plugins που το βαραίνουν.",
      en: "We build websites that load instantly, look right on every phone and bring in calls — not just visits. Every site is written from scratch in Next.js and React, with no off-the-shelf template and no plugin pile-up.",
    },
    sections: [
      {
        heading: {
          el: "Ο επισκέπτης αποφασίζει σε τρία δευτερόλεπτα",
          en: "A visitor decides in three seconds",
        },
        body: {
          el: "Οκτώ στους δέκα θα σε δουν πρώτη φορά από κινητό, συνήθως με δεδομένα και βιασύνη. Γι' αυτό σχεδιάζουμε mobile-first: το τηλέφωνο, η φόρμα ή το κουμπί κράτησης βρίσκονται εκεί που πέφτει ο αντίχειρας, οι εικόνες σερβίρονται σε σύγχρονα formats και το περιεχόμενο εμφανίζεται πριν προλάβει κανείς να πατήσει «πίσω».",
          en: "Most people will meet your business for the first time on a phone, on mobile data, in a hurry. So we design mobile-first: the phone number, the form or the booking button sit where the thumb lands, images ship in modern formats, and the content appears before anyone reaches for the back button.",
        },
      },
      {
        heading: {
          el: "Χτισμένο για τη Google από την πρώτη γραμμή κώδικα",
          en: "Built for Google from the first line of code",
        },
        body: {
          el: "Το SEO δεν είναι κάτι που «προσθέτεις μετά». Οι σελίδες μας αποδίδονται στον server, έχουν καθαρή σημασιολογική δομή, μοναδικά titles και descriptions, structured data, sitemap και hreflang για κάθε γλώσσα. Έτσι η Google — και οι μηχανές απαντήσεων όπως το ChatGPT — διαβάζουν ακριβώς τι κάνεις και πού.",
          en: "SEO is not something you bolt on afterwards. Pages are server-rendered, semantically structured, and ship with unique titles and descriptions, structured data, a sitemap and hreflang for every language — so Google and answer engines like ChatGPT read exactly what you do and where.",
        },
      },
      {
        heading: {
          el: "Δικό σου, όχι νοικιασμένο",
          en: "Yours, not rented",
        },
        body: {
          el: "Ο κώδικας, το domain και τα δεδομένα σου είναι δικά σου. Δεν πληρώνεις μηνιαία συνδρομή σε πλατφόρμα για να μείνει ζωντανό το site σου, και δεν κλειδώνεσαι σε έναν πάροχο. Αλλάζεις κείμενα, φωτογραφίες και τιμές μόνος σου από το διαχειριστικό· για ό,τι άλλο, είμαστε εδώ.",
          en: "The code, the domain and the data are yours. There is no monthly platform fee keeping your site alive and no vendor lock-in. You edit copy, photos and prices yourself from the admin; for everything else, we are around.",
        },
      },
    ],
    deliverables: {
      el: [
        "Custom σχεδιασμός στα χρώματα και το ύφος της επιχείρησής σου",
        "Mobile-first ανάπτυξη και άριστα Core Web Vitals",
        "Τεχνικό SEO: schema, sitemap, canonical, hreflang",
        "Φόρμα επικοινωνίας, Google Maps, click-to-call, WhatsApp",
        "Δίγλωσσο περιεχόμενο (ελληνικά / αγγλικά) όπου χρειάζεται",
        "SSL, GDPR συμμόρφωση και υποστήριξη μετά το launch",
      ],
      en: [
        "Custom design in your brand's colours and tone",
        "Mobile-first build with strong Core Web Vitals",
        "Technical SEO: schema, sitemap, canonicals, hreflang",
        "Contact form, Google Maps, click-to-call, WhatsApp",
        "Bilingual content (Greek / English) where it earns its place",
        "SSL, GDPR compliance and support after launch",
      ],
    },
    faq: [
      {
        question: {
          el: "Πόσο κοστίζει η κατασκευή μιας ιστοσελίδας;",
          en: "How much does a website cost?",
        },
        answer: {
          el: "Εξαρτάται από το πόσες σελίδες και λειτουργίες χρειάζεσαι — ένα site παρουσίασης για ένα τοπικό κατάστημα δεν κοστίζει όσο μια πλατφόρμα με κρατήσεις και πληρωμές. Στέλνουμε γραπτή προσφορά με σταθερό ποσό και ξεκάθαρο περιεχόμενο πριν ξεκινήσει οτιδήποτε, χωρίς κρυφές χρεώσεις.",
          en: "It depends on the pages and features you need — a brochure site for a local shop is not priced like a platform with booking and payments. You get a written, fixed-price quote with a clear scope before anything starts, with no hidden extras.",
        },
      },
      {
        question: {
          el: "Σε πόσο καιρό είναι έτοιμη;",
          en: "How long does it take?",
        },
        answer: {
          el: "Μια ιστοσελίδα παρουσίασης είναι συνήθως έτοιμη μέσα σε λίγες εβδομάδες από τη στιγμή που έχουμε κείμενα και φωτογραφίες. Το ακριβές χρονοδιάγραμμα κλειδώνει μαζί με την προσφορά, ώστε να ξέρεις ημερομηνία και όχι ευχολόγιο.",
          en: "A brochure site is usually ready within a few weeks of us having copy and photos. The exact timeline is agreed with the quote, so you get a date rather than a promise.",
        },
      },
      {
        question: {
          el: "Θα με βρίσκει ο κόσμος στη Google;",
          en: "Will people find me on Google?",
        },
        answer: {
          el: "Κάθε site παραδίδεται με τεχνικό SEO, δομημένα δεδομένα και σύνδεση με Google Search Console, ώστε να ευρετηριάζεται σωστά από την πρώτη μέρα. Η κατάταξη για ανταγωνιστικές φράσεις θέλει και συνεχές περιεχόμενο — αυτό το δουλεύουμε στην υπηρεσία SEO & AEO.",
          en: "Every site ships with technical SEO, structured data and Search Console wired up, so it indexes correctly from day one. Ranking for competitive phrases also needs ongoing content — that is what the SEO & AEO service is for.",
        },
      },
      {
        question: {
          el: "Μπορώ να αλλάζω μόνος μου τα κείμενα;",
          en: "Can I edit the content myself?",
        },
        answer: {
          el: "Ναι. Όπου χρειάζεται συχνή αλλαγή — τιμοκατάλογος, νέα, γκαλερί, ωράριο — μπαίνει διαχειριστικό που το χειρίζεσαι χωρίς τεχνικές γνώσεις και χωρίς να περιμένεις developer.",
          en: "Yes. Wherever content changes often — price list, news, gallery, opening hours — we add an admin you can use without technical knowledge and without waiting for a developer.",
        },
      },
    ],
    projectSlugs: [
      "moisis-flower-design",
      "4yournails",
      "antoniadis-autoservice",
      "iatriki-apokatastasi",
    ],
  },
  {
    key: "eshop",
    icon: ShoppingCart,
    slug: { el: "kataskevi-eshop", en: "ecommerce-development" },
    h1: {
      el: "Κατασκευή E-shop",
      en: "E-shop Development",
    },
    metaTitle: {
      el: "Κατασκευή E-shop & Ηλεκτρονικού Καταστήματος",
      en: "E-shop & Online Store Development",
    },
    metaDescription: {
      el: "Κατασκευή eshop με πληρωμές Stripe, αυτόματη έκδοση παραστατικών μέσω myDATA και ταχύτητα που κρατάει τον πελάτη στο καλάθι. Ζήτα δωρεάν προσφορά.",
      en: "E-shop development with Stripe payments, automated Greek myDATA invoicing and the speed that keeps a shopper in the cart. Ask for a free quote.",
    },
    intro: {
      el: "Ένα ηλεκτρονικό κατάστημα που πουλάει δεν είναι κατάλογος προϊόντων — είναι μια διαδρομή από την πρώτη αναζήτηση μέχρι την ολοκλήρωση της παραγγελίας, χωρίς τριβές. Στήνουμε eshop με πληρωμές Stripe, αυτόματη τιμολόγηση στο myDATA και checkout που δεν χάνει καλάθια.",
      en: "An online store that sells is not a product catalogue — it is a path from first search to completed order with nothing in the way. We build e-shops with Stripe payments, automated Greek myDATA invoicing and a checkout that does not lose carts.",
    },
    sections: [
      {
        heading: {
          el: "Πληρωμές με τις χαμηλότερες προμήθειες",
          en: "Payments with the lowest fees",
        },
        body: {
          el: "Δέχεσαι κάρτες, Apple Pay και Google Pay μέσω Stripe, με προμήθειες σαφώς χαμηλότερες από τις πλατφόρμες delivery και marketplace. Τα χρήματα πηγαίνουν στον λογαριασμό σου, ο πελάτης μένει στο δικό σου brand και δεν πληρώνεις ποσοστό σε τρίτον για κάθε παραγγελία.",
          en: "Take cards, Apple Pay and Google Pay through Stripe, at fees well below what delivery platforms and marketplaces charge. The money lands in your account, the customer stays inside your brand, and you are not paying a third party a slice of every order.",
        },
      },
      {
        heading: {
          el: "Παραστατικά που εκδίδονται μόνα τους (ΑΑΔΕ myDATA)",
          en: "Invoices that issue themselves (Greek myDATA)",
        },
        body: {
          el: "Κάθε παραγγελία συνδέεται αυτόματα με το myDATA της ΑΑΔΕ: το παραστατικό εκδίδεται και διαβιβάζεται χωρίς να αντιγράψει κανείς τίποτα σε excel. Λιγότερα λάθη, λιγότερος χρόνος στο τέλος του μήνα και ο λογιστής σου βλέπει καθαρά δεδομένα.",
          en: "Every order is wired into the Greek tax authority's myDATA: the invoice is issued and transmitted without anyone copying anything into a spreadsheet. Fewer errors, less month-end work, and clean data for your accountant.",
        },
      },
      {
        heading: {
          el: "Προϊόντα που εμφανίζονται στη Google",
          en: "Products that show up on Google",
        },
        body: {
          el: "Κάθε προϊόν και κάθε κατηγορία παίρνει δική της σελίδα, δικό της title και structured data τύπου Product — με τιμή και διαθεσιμότητα. Έτσι μπαίνεις στα αποτελέσματα με εικόνα και τιμή, όχι ως ένα ακόμα όνομα σε λίστα, και τροφοδοτείς σωστά τα Google Shopping feeds.",
          en: "Every product and category gets its own page, its own title and Product structured data with price and availability. That is what puts you in the results with an image and a price instead of a bare link, and what feeds Google Shopping properly.",
        },
      },
    ],
    deliverables: {
      el: [
        "Κατάλογος προϊόντων με κατηγορίες, φίλτρα και αναζήτηση",
        "Checkout μίας σελίδας με Stripe, Apple Pay και Google Pay",
        "Αυτόματη διαβίβαση παραστατικών στο myDATA",
        "Διαχείριση παραγγελιών, αποθέματος και εκπτωτικών κουπονιών",
        "Product schema, sitemap προϊόντων και feed για Google Shopping",
        "Delivery ή παραλαβή από το κατάστημα, με ειδοποιήσεις email",
      ],
      en: [
        "Product catalogue with categories, filters and search",
        "Single-page checkout with Stripe, Apple Pay and Google Pay",
        "Automated myDATA invoice transmission",
        "Order, stock and discount-coupon management",
        "Product schema, product sitemap and a Google Shopping feed",
        "Delivery or in-store pickup, with email notifications",
      ],
    },
    faq: [
      {
        question: {
          el: "Custom eshop ή έτοιμη πλατφόρμα;",
          en: "Custom e-shop or a ready-made platform?",
        },
        answer: {
          el: "Οι έτοιμες πλατφόρμες ξεκινούν φθηνά και κοστίζουν ακριβά: μηνιαία συνδρομή, προμήθεια στις πωλήσεις, plugins για κάθε λειτουργία και ταχύτητα που πέφτει όσο μεγαλώνει ο κατάλογος. Ένα custom eshop σε Next.js είναι δικό σου, πιο γρήγορο και φτιαγμένο γύρω από τον τρόπο που δουλεύεις.",
          en: "Ready-made platforms start cheap and get expensive: a monthly fee, a cut of your sales, a plugin for every feature and speed that degrades as the catalogue grows. A custom Next.js store is yours, faster, and shaped around how you actually work.",
        },
      },
      {
        question: {
          el: "Δουλεύει και για delivery φαγητού;",
          en: "Does it work for food delivery?",
        },
        answer: {
          el: "Ναι — το έχουμε κάνει. Το Orderoo είναι πλατφόρμα online παραγγελιών με 0% προμήθεια για τοπικά καταστήματα, και το χρησιμοποιούν κρεοπωλεία, ιχθυοπωλεία και καταστήματα εστίασης αντί για τις μεγάλες εφαρμογές delivery.",
          en: "Yes — we have done it. Orderoo is a zero-commission online ordering platform for local shops, used by butchers, fishmongers and food businesses instead of the big delivery apps.",
        },
      },
      {
        question: {
          el: "Πόσα προϊόντα αντέχει;",
          en: "How many products can it handle?",
        },
        answer: {
          el: "Από δέκα μέχρι δεκάδες χιλιάδες. Οι σελίδες προϊόντων δημιουργούνται στατικά και σερβίρονται από CDN, οπότε ο χρόνος φόρτωσης δεν αλλάζει επειδή μεγάλωσε ο κατάλογος.",
          en: "From ten to tens of thousands. Product pages are generated statically and served from a CDN, so load time does not change because the catalogue grew.",
        },
      },
      {
        question: {
          el: "Μπορώ να μεταφέρω το υπάρχον eshop μου;",
          en: "Can I migrate my existing store?",
        },
        answer: {
          el: "Ναι. Μεταφέρουμε προϊόντα, κατηγορίες και πελάτες, και στήνουμε 301 ανακατευθύνσεις από τα παλιά URL ώστε να μη χαθεί η θέση σου στη Google.",
          en: "Yes. We migrate products, categories and customers, and set up 301 redirects from the old URLs so you keep the rankings you already have.",
        },
      },
    ],
    projectSlugs: [
      "orderoo",
      "vous-kreopoleio",
      "sifnios-ixthiopolio",
      "stone-massage-athens",
    ],
  },
  {
    key: "webApps",
    icon: AppWindow,
    slug: { el: "kataskevi-efarmogon", en: "web-app-development" },
    h1: {
      el: "Κατασκευή Εφαρμογών",
      en: "Web App Development",
    },
    metaTitle: {
      el: "Κατασκευή Εφαρμογών & Web Apps",
      en: "Web & Mobile App Development",
    },
    metaDescription: {
      el: "Κατασκευή web εφαρμογών με dashboards, ρόλους χρηστών, κρατήσεις και πληρωμές. Full-stack ανάπτυξη σε Next.js για επιχειρήσεις που θέλουν δικό τους σύστημα.",
      en: "Web application development with dashboards, user roles, bookings and payments. Full-stack Next.js builds for businesses that need their own system.",
    },
    intro: {
      el: "Όταν το Excel, τα τηλέφωνα και τα post-it δεν βγάζουν άκρη, χρειάζεσαι σύστημα. Φτιάχνουμε web εφαρμογές που τρέχουν σε κινητό και υπολογιστή χωρίς εγκατάσταση: κρατήσεις, παραγγελίες, πελατολόγιο, ρόλοι χρηστών και αναφορές σε ένα σημείο.",
      en: "When spreadsheets, phone calls and sticky notes stop scaling, you need a system. We build web apps that run on phone and desktop with nothing to install: bookings, orders, customer records, user roles and reporting in one place.",
    },
    sections: [
      {
        heading: {
          el: "Εφαρμογή χωρίς κατέβασμα από store",
          en: "An app with no store download",
        },
        body: {
          el: "Οι εφαρμογές μας είναι Progressive Web Apps: ο πελάτης ανοίγει έναν σύνδεσμο και τη χρησιμοποιεί αμέσως, ή την «καρφιτσώνει» στην αρχική οθόνη του κινητού σαν κανονική εφαρμογή. Καμία έγκριση από App Store, καμία ενημέρωση που πρέπει να κατεβάσει ο χρήστης.",
          en: "Our apps are Progressive Web Apps: a customer opens a link and uses it immediately, or pins it to their home screen like a native app. No App Store review, no update for the user to download.",
        },
      },
      {
        heading: {
          el: "Ρόλοι, δικαιώματα και δεδομένα που αντέχουν",
          en: "Roles, permissions and data that holds up",
        },
        body: {
          el: "Διαχειριστής, προσωπικό, πελάτης — ο καθένας βλέπει ακριβώς όσα πρέπει. Τα δεδομένα ζουν σε PostgreSQL με σαφές σχήμα, αντίγραφα ασφαλείας και έλεγχο πρόσβασης, όχι σε ένα κοινόχρηστο αρχείο που μπορεί να σβήσει κατά λάθος ο οποιοσδήποτε.",
          en: "Admin, staff, customer — each sees exactly what they should. Data lives in PostgreSQL with a clear schema, backups and access control, not in a shared file anyone can delete by accident.",
        },
      },
      {
        heading: {
          el: "Ξεκινάμε από το μικρότερο χρήσιμο κομμάτι",
          en: "We start with the smallest useful piece",
        },
        body: {
          el: "Δεν χτίζουμε δεκαοκτώ μήνες στα τυφλά. Βγάζουμε πρώτα τη λειτουργία που λύνει τον μεγαλύτερο πόνο, τη δίνουμε σε πραγματικούς χρήστες και χτίζουμε πάνω σε αυτό που όντως χρησιμοποιείται. Έτσι το σύστημα αποδίδει πριν ολοκληρωθεί.",
          en: "We do not build blind for eighteen months. We ship the feature that removes the biggest pain first, put it in front of real users, and build on what actually gets used — so the system pays off before it is finished.",
        },
      },
    ],
    deliverables: {
      el: [
        "Full-stack ανάπτυξη σε Next.js, TypeScript και PostgreSQL",
        "Σύστημα χρηστών με ρόλους, δικαιώματα και σύνδεση Google",
        "Dashboards και αναφορές σε πραγματικό χρόνο",
        "Κρατήσεις, παραγγελίες ή ό,τι απαιτεί η ροή σου",
        "Πληρωμές Stripe και ειδοποιήσεις email / SMS",
        "Φιλοξενία, παρακολούθηση σφαλμάτων και αντίγραφα ασφαλείας",
      ],
      en: [
        "Full-stack build in Next.js, TypeScript and PostgreSQL",
        "User system with roles, permissions and Google sign-in",
        "Real-time dashboards and reporting",
        "Bookings, orders, or whatever your workflow needs",
        "Stripe payments and email / SMS notifications",
        "Hosting, error monitoring and backups",
      ],
    },
    faq: [
      {
        question: {
          el: "Web εφαρμογή ή native mobile app;",
          en: "Web app or native mobile app?",
        },
        answer: {
          el: "Για την πλειονότητα των επιχειρήσεων η web εφαρμογή κάνει την ίδια δουλειά με μικρότερο κόστος: μία βάση κώδικα αντί για τρεις, άμεσες ενημερώσεις και καμία εξάρτηση από εγκρίσεις store. Native πάμε μόνο αν χρειάζεσαι κάτι που απαιτεί βαθιά πρόσβαση στη συσκευή.",
          en: "For most businesses a web app does the same job for less: one codebase instead of three, instant updates and no store approvals. We go native only when you genuinely need deep device access.",
        },
      },
      {
        question: {
          el: "Συνδέεται με τα προγράμματα που ήδη χρησιμοποιώ;",
          en: "Will it connect to the tools I already use?",
        },
        answer: {
          el: "Ναι, εφόσον το εργαλείο έχει API — CRM, λογιστικό, email marketing, ημερολόγια, αποθήκη. Όπου δεν υπάρχει API, συνήθως υπάρχει άλλος δρόμος· το ελέγχουμε πριν σου δώσουμε προσφορά.",
          en: "Yes, as long as the tool has an API — CRM, accounting, email marketing, calendars, inventory. Where there is no API there is usually another route; we check before quoting.",
        },
      },
      {
        question: {
          el: "Ποιος έχει τον κώδικα;",
          en: "Who owns the code?",
        },
        answer: {
          el: "Εσύ. Παραδίδουμε πλήρη πρόσβαση στο αποθετήριο και στην υποδομή. Δεν κρατάμε τίποτα όμηρο για να είμαστε απαραίτητοι.",
          en: "You do. You get full access to the repository and the infrastructure. We do not hold anything hostage to stay necessary.",
        },
      },
      {
        question: {
          el: "Τι γίνεται μετά την παράδοση;",
          en: "What happens after launch?",
        },
        answer: {
          el: "Μένουμε για υποστήριξη, διορθώσεις και νέες λειτουργίες. Οι περισσότεροι πελάτες συνεχίζουν με μηνιαία συντήρηση, αλλά δεν είναι υποχρεωτικό — το σύστημα λειτουργεί και χωρίς εμάς.",
          en: "We stay on for support, fixes and new features. Most clients continue on a monthly maintenance plan, but it is not compulsory — the system runs without us.",
        },
      },
    ],
    projectSlugs: ["kratisix", "orderoo", "1-percent-club", "salsa-rayo"],
  },
  {
    key: "automations",
    icon: Bot,
    slug: { el: "ai-automation", en: "ai-automation" },
    h1: {
      el: "AI Αυτοματισμοί",
      en: "AI Automation",
    },
    metaTitle: {
      el: "AI Αυτοματισμοί για Επιχειρήσεις",
      en: "AI Automation for Business",
    },
    metaDescription: {
      el: "Αυτοματισμοί με τεχνητή νοημοσύνη: απαντήσεις σε πελάτες, καταχώριση παραστατικών, ραντεβού και αναφορές χωρίς χειρωνακτική δουλειά. Δες τι μπορεί να αυτοματοποιηθεί.",
      en: "AI automation for customer replies, document entry, appointments and reporting — without the manual work. See what can be automated.",
    },
    intro: {
      el: "Κάθε επιχείρηση έχει δουλειές που τρώνε ώρες και δεν αποδίδουν τίποτα: αντιγραφή δεδομένων, ίδιες απαντήσεις σε ίδιες ερωτήσεις, αναφορές που φτιάχνονται με το χέρι. Αυτά τα αναλαμβάνει η τεχνητή νοημοσύνη — και εσύ παίρνεις πίσω τον χρόνο σου.",
      en: "Every business has work that eats hours and returns nothing: copying data around, answering the same questions the same way, assembling reports by hand. That is what AI takes over — and you get the hours back.",
    },
    sections: [
      {
        heading: {
          el: "Ξεκινάμε από τον χρόνο, όχι από την τεχνολογία",
          en: "We start from the hours, not the technology",
        },
        body: {
          el: "Πρώτα κοιτάμε πού φεύγουν πραγματικά οι ώρες της εβδομάδας. Αν μια εργασία γίνεται συχνά, ακολουθεί κανόνες και δεν απαιτεί κρίση, είναι υποψήφια για αυτοματισμό. Αν όχι, σου το λέμε — δεν πουλάμε AI για να πουλήσουμε AI.",
          en: "First we look at where the week's hours actually go. If a task is frequent, rule-based and needs no judgement, it is a candidate. If it is not, we say so — we do not sell AI for the sake of selling AI.",
        },
      },
      {
        heading: {
          el: "Τα εργαλεία σου, συνδεδεμένα μεταξύ τους",
          en: "Your tools, finally talking to each other",
        },
        body: {
          el: "Email, φόρμες, ημερολόγιο, λογιστικό, CRM, αποθήκη: τα συνδέουμε ώστε μια πληροφορία να καταχωρείται μία φορά και να ταξιδεύει μόνη της. Μια νέα παραγγελία μπορεί να ενημερώνει απόθεμα, να στέλνει επιβεβαίωση και να δημιουργεί παραστατικό χωρίς να πατήσει κανείς κουμπί.",
          en: "Email, forms, calendar, accounting, CRM, inventory: we wire them together so a piece of information is entered once and travels on its own. A new order can update stock, send a confirmation and create an invoice with nobody pressing a button.",
        },
      },
      {
        heading: {
          el: "Αυτοματισμοί που ξέρουν πότε να ρωτήσουν",
          en: "Automation that knows when to ask",
        },
        body: {
          el: "Ένας αυτοματισμός που κάνει λάθος αθόρυβα είναι χειρότερος από καθόλου αυτοματισμό. Γι' αυτό κάθε ροή έχει όρια, καταγραφή και σημείο ελέγχου: όταν το σύστημα δεν είναι σίγουρο, σταματά και ζητά άνθρωπο αντί να μαντέψει.",
          en: "Automation that fails quietly is worse than none. So every flow has limits, logging and a checkpoint: when the system is not confident, it stops and asks a human instead of guessing.",
        },
      },
    ],
    deliverables: {
      el: [
        "Χαρτογράφηση των εργασιών που αξίζει να αυτοματοποιηθούν",
        "Αυτόματη άντληση δεδομένων από email, PDF και φόρμες",
        "Chatbot ή απαντητής που ξέρει τα δικά σου δεδομένα",
        "Συνδέσεις μεταξύ CRM, λογιστικού, ημερολογίου και αποθήκης",
        "Αυτόματες αναφορές και ειδοποιήσεις στην ομάδα",
        "Καταγραφή, έλεγχος ποιότητας και ανθρώπινο σημείο ελέγχου",
      ],
      en: [
        "A map of the tasks actually worth automating",
        "Automatic data extraction from email, PDFs and forms",
        "A chatbot or auto-responder that knows your own data",
        "Connections between CRM, accounting, calendar and inventory",
        "Automated reports and alerts for the team",
        "Logging, quality checks and a human checkpoint",
      ],
    },
    faq: [
      {
        question: {
          el: "Τι μπορεί ρεαλιστικά να αυτοματοποιηθεί;",
          en: "What can realistically be automated?",
        },
        answer: {
          el: "Ό,τι επαναλαμβάνεται και ακολουθεί κανόνες: καταχώριση τιμολογίων, απαντήσεις σε συχνές ερωτήσεις, υπενθυμίσεις ραντεβού, ταξινόμηση αιτημάτων, εβδομαδιαίες αναφορές. Ό,τι απαιτεί διαπραγμάτευση, κρίση ή σχέση με τον πελάτη μένει σε ανθρώπους.",
          en: "Anything repetitive and rule-based: invoice entry, common replies, appointment reminders, triaging requests, weekly reports. Anything requiring negotiation, judgement or a relationship stays with people.",
        },
      },
      {
        question: {
          el: "Είναι ασφαλή τα δεδομένα της επιχείρησής μου;",
          en: "Is my business data safe?",
        },
        answer: {
          el: "Τα δεδομένα μένουν στα δικά σου συστήματα και στέλνουμε στο μοντέλο μόνο ό,τι χρειάζεται για τη συγκεκριμένη εργασία. Χρησιμοποιούμε επιχειρηματικά API που δεν εκπαιδεύονται στα δεδομένα σου, και όλη η ροή σχεδιάζεται με GDPR κατά νου.",
          en: "Data stays in your systems and only what a given task needs is sent to the model. We use business APIs that do not train on your data, and every flow is designed with GDPR in mind.",
        },
      },
      {
        question: {
          el: "Θα χάσω προσωπικό;",
          en: "Will this cost me staff?",
        },
        answer: {
          el: "Στους πελάτες μας η συνήθης έκβαση είναι διαφορετική: το ίδιο προσωπικό σταματά να κάνει αντιγραφή-επικόλληση και ασχολείται με πελάτες και πωλήσεις. Ο αυτοματισμός αφαιρεί εργασίες, όχι ανθρώπους.",
          en: "With our clients the usual outcome is different: the same people stop copy-pasting and spend the time on customers and sales. Automation removes tasks, not people.",
        },
      },
      {
        question: {
          el: "Πόσο γρήγορα βλέπω αποτέλεσμα;",
          en: "How quickly do I see results?",
        },
        answer: {
          el: "Ο πρώτος αυτοματισμός είναι συνήθως μικρός και στοχευμένος, ώστε να μετρηθεί το όφελος άμεσα. Αν δεν εξοικονομεί χρόνο, δεν προχωράμε σε δεύτερο.",
          en: "The first automation is usually small and targeted so the benefit is measurable straight away. If it does not save time, we do not build a second one.",
        },
      },
    ],
    projectSlugs: ["orderoo", "kratisix"],
  },
  {
    key: "seoAeo",
    icon: Search,
    slug: { el: "seo-aeo", en: "seo-aeo" },
    h1: {
      el: "SEO & AEO",
      en: "SEO & AEO",
    },
    metaTitle: {
      el: "SEO Αθήνα & AEO — Κατάταξη σε Google και AI",
      en: "SEO & Answer Engine Optimization",
    },
    metaDescription: {
      el: "Τεχνικό SEO, τοπικό SEO και AEO ώστε να σε βρίσκει ο κόσμος στη Google και να σε προτείνουν ChatGPT, Perplexity και Google AI. Μετρήσιμα, με δεδομένα Search Console.",
      en: "Technical SEO, local SEO and AEO so people find you on Google and ChatGPT, Perplexity and Google AI recommend you. Measured against Search Console data.",
    },
    intro: {
      el: "Η αναζήτηση δεν γίνεται πια μόνο στη Google. Ο μισός κόσμος ρωτάει πλέον ένα AI «ποιον να πάρω για...» και δέχεται την πρώτη απάντηση. Δουλεύουμε και τα δύο: κλασικό SEO για την κατάταξη και AEO ώστε να είσαι εσύ η απάντηση που δίνει το μοντέλο.",
      en: "Search no longer happens only on Google. Half your market now asks an AI \"who should I call for...\" and takes the first answer. We work both: classic SEO for rankings, and AEO so you are the answer the model gives.",
    },
    sections: [
      {
        heading: {
          el: "Τεχνικό SEO: πρώτα να μπορεί να σε διαβάσει",
          en: "Technical SEO: first, be readable",
        },
        body: {
          el: "Ταχύτητα, δομή, canonical, hreflang, structured data, εσωτερική διασύνδεση, sitemap χωρίς σφάλματα. Αν η Google δυσκολεύεται να διαβάσει τη σελίδα ή τη θεωρεί διπλότυπη, κανένα κείμενο δεν πρόκειται να την ανεβάσει.",
          en: "Speed, structure, canonicals, hreflang, structured data, internal linking, a sitemap without errors. If Google struggles to read a page or treats it as a duplicate, no amount of copy will lift it.",
        },
      },
      {
        heading: {
          el: "Τοπικό SEO: να σε βρίσκουν στη γειτονιά σου",
          en: "Local SEO: be found in your own neighbourhood",
        },
        body: {
          el: "Για μια επιχείρηση με φυσική έδρα, οι αναζητήσεις «κοντά μου» είναι οι πιο κερδοφόρες. Στήνουμε σωστά το Προφίλ Επιχείρησης Google, τα σήματα NAP, τα LocalBusiness δομημένα δεδομένα και σελίδες ανά περιοχή, ώστε να εμφανίζεσαι στον χάρτη και όχι μόνο στα οργανικά.",
          en: "For a business with a physical location, \"near me\" searches are the profitable ones. We set up the Google Business Profile properly, the NAP signals, LocalBusiness structured data and per-area pages, so you show up on the map and not only in the blue links.",
        },
      },
      {
        heading: {
          el: "AEO: να σε αναφέρουν τα μοντέλα",
          en: "AEO: get cited by the models",
        },
        body: {
          el: "Οι μηχανές απαντήσεων προτιμούν περιεχόμενο που απαντά καθαρά σε μια ερώτηση, με δεδομένα που επαληθεύονται και σήμανση που διαβάζεται από μηχανή. Γράφουμε ενότητες ερωτήσεων-απαντήσεων, προσθέτουμε FAQ schema και κρατάμε τα στοιχεία σου συνεπή παντού — γιατί έτσι διαλέγει ποιον θα αναφέρει ένα μοντέλο.",
          en: "Answer engines favour content that answers a question cleanly, with verifiable detail and machine-readable markup. We write question-and-answer sections, add FAQ schema and keep your details consistent everywhere — that is how a model decides who to cite.",
        },
      },
    ],
    deliverables: {
      el: [
        "Τεχνικός έλεγχος και διορθώσεις ευρετηρίασης",
        "Έρευνα λέξεων-κλειδιών με πραγματικό όγκο αναζήτησης",
        "Βελτιστοποίηση titles, descriptions και εσωτερικής διασύνδεσης",
        "Ρύθμιση Προφίλ Επιχείρησης Google και τοπικών σημάτων",
        "Structured data: LocalBusiness, Service, FAQ, Breadcrumb",
        "Μηνιαία αναφορά με δεδομένα Google Search Console",
      ],
      en: [
        "Technical audit and indexing fixes",
        "Keyword research grounded in real search volume",
        "Titles, descriptions and internal linking rewritten",
        "Google Business Profile and local signals set up",
        "Structured data: LocalBusiness, Service, FAQ, Breadcrumb",
        "Monthly reporting from Google Search Console data",
      ],
    },
    faq: [
      {
        question: {
          el: "Σε πόσο καιρό ανεβαίνω στη Google;",
          en: "How long until I rank on Google?",
        },
        answer: {
          el: "Τα τεχνικά προβλήματα διορθώνονται αμέσως και φαίνονται σε εβδομάδες. Η κατάταξη σε ανταγωνιστικές φράσεις είναι θέμα μηνών και εξαρτάται από τον ανταγωνισμό στον κλάδο σου. Όποιος υπόσχεται πρώτη θέση σε δεκαπέντε μέρες, δεν λέει αλήθεια.",
          en: "Technical problems are fixed immediately and show within weeks. Ranking for competitive phrases takes months and depends on your sector. Anyone promising the top spot in a fortnight is not telling the truth.",
        },
      },
      {
        question: {
          el: "Τι είναι το AEO και γιατί με αφορά;",
          en: "What is AEO and why does it matter?",
        },
        answer: {
          el: "Answer Engine Optimization: βελτιστοποίηση ώστε να σε αναφέρουν ChatGPT, Perplexity, Google AI Overviews και άλλα μοντέλα όταν κάποιος ρωτά ποιον να εμπιστευτεί. Όλο και περισσότεροι πελάτες δεν φτάνουν ποτέ σε σελίδα αποτελεσμάτων — παίρνουν απευθείας μια σύσταση.",
          en: "Answer Engine Optimization: getting cited by ChatGPT, Perplexity, Google AI Overviews and others when someone asks who to trust. More and more customers never reach a results page at all — they get a recommendation directly.",
        },
      },
      {
        question: {
          el: "Δουλεύετε SEO και σε site που δεν φτιάξατε εσείς;",
          en: "Do you do SEO on sites you did not build?",
        },
        answer: {
          el: "Ναι. Ξεκινάμε με τεχνικό έλεγχο και σου λέμε τι διορθώνεται πάνω στο υπάρχον site και τι θα κόστιζε λιγότερο να ξαναχτιστεί. Καμιά φορά η ειλικρινής απάντηση είναι η δεύτερη.",
          en: "Yes. We start with a technical audit and tell you what can be fixed on the current site and what would be cheaper to rebuild. Sometimes the honest answer is the second one.",
        },
      },
      {
        question: {
          el: "Πώς μετράται το αποτέλεσμα;",
          en: "How is the result measured?",
        },
        answer: {
          el: "Με δεδομένα Google Search Console: εμφανίσεις, κλικ, μέση θέση ανά φράση και ανά σελίδα, σε σύγκριση με την προηγούμενη περίοδο. Όχι με screenshots από εργαλεία κατάταξης που δείχνουν ό,τι μας βολεύει.",
          en: "With Google Search Console data: impressions, clicks, average position per query and per page, compared against the previous period. Not with screenshots from rank trackers showing whatever flatters us.",
        },
      },
    ],
    projectSlugs: ["stone-massage-athens", "shuk-athens", "4yournails"],
  },
  {
    key: "ads",
    icon: Megaphone,
    slug: { el: "google-ads", en: "google-ads" },
    h1: {
      el: "Διαφημίσεις Google & Meta",
      en: "Google & Meta Advertising",
    },
    metaTitle: {
      el: "Διαφημίσεις Google Ads & Meta",
      en: "Google Ads & Meta Advertising",
    },
    metaDescription: {
      el: "Καμπάνιες Google Ads και Meta που φέρνουν πελάτες, όχι κλικ. Στήσιμο, παρακολούθηση μετατροπών και μηνιαία αναφορά με καθαρά νούμερα.",
      en: "Google Ads and Meta campaigns that bring customers, not clicks. Setup, conversion tracking and monthly reporting with honest numbers.",
    },
    intro: {
      el: "Η διαφήμιση είναι το γρηγορότερο κανάλι — και το ευκολότερο για να κάψεις χρήματα. Στήνουμε καμπάνιες με σαφή στόχο, σωστή μέτρηση μετατροπών και σελίδες προορισμού που δικαιολογούν το κλικ.",
      en: "Advertising is the fastest channel — and the easiest place to burn money. We run campaigns with a defined goal, proper conversion tracking, and landing pages that justify the click.",
    },
    sections: [
      {
        heading: {
          el: "Πρώτα η μέτρηση, μετά η δαπάνη",
          en: "Measurement first, spend second",
        },
        body: {
          el: "Πριν ανέβει ένα ευρώ, στήνουμε παρακολούθηση μετατροπών: κλήσεις, φόρμες, παραγγελίες, κρατήσεις. Χωρίς αυτό, κάθε αναφορά είναι εικασία και κάθε βελτιστοποίηση μαντεψιά.",
          en: "Before a single euro goes up, conversion tracking goes in: calls, forms, orders, bookings. Without it every report is a guess and every optimisation is a coin flip.",
        },
      },
      {
        heading: {
          el: "Η σελίδα προορισμού κάνει τη μισή δουλειά",
          en: "The landing page does half the work",
        },
        body: {
          el: "Δεν έχει νόημα να πληρώνεις για κλικ που προσγειώνονται σε αργή, μπερδεμένη σελίδα. Επειδή φτιάχνουμε και τα sites, η διαφήμιση και η σελίδα σχεδιάζονται μαζί — ίδιο μήνυμα, γρήγορη φόρτωση, ένα ξεκάθαρο επόμενο βήμα.",
          en: "There is no point paying for clicks that land on a slow, confusing page. Because we build the sites too, the ad and the page are designed together — same message, fast load, one clear next step.",
        },
      },
      {
        heading: {
          el: "Αναφορές που λένε την αλήθεια",
          en: "Reporting that tells the truth",
        },
        body: {
          el: "Κάθε μήνα βλέπεις πόσο ξοδεύτηκε, πόσες μετατροπές ήρθαν, πόσο κόστισε η καθεμία και τι αλλάζουμε τον επόμενο μήνα. Αν μια καμπάνια δεν αποδίδει, θα το διαβάσεις από εμάς πριν το καταλάβεις μόνος σου.",
          en: "Every month you see what was spent, how many conversions it produced, what each one cost and what we are changing next. If a campaign is not working, you hear it from us before you notice it yourself.",
        },
      },
    ],
    deliverables: {
      el: [
        "Στήσιμο λογαριασμών Google Ads και Meta Business",
        "Παρακολούθηση μετατροπών, Meta Pixel και server-side events",
        "Έρευνα λέξεων-κλειδιών και αρνητικές λέξεις που σώζουν budget",
        "Δημιουργικά και κείμενα αγγελιών σε ελληνικά και αγγλικά",
        "Σελίδες προορισμού φτιαγμένες για τη συγκεκριμένη καμπάνια",
        "Μηνιαία αναφορά με κόστος ανά πελάτη και επόμενα βήματα",
      ],
      en: [
        "Google Ads and Meta Business account setup",
        "Conversion tracking, Meta Pixel and server-side events",
        "Keyword research plus the negative keywords that save budget",
        "Ad creative and copy in Greek and English",
        "Landing pages built for the specific campaign",
        "Monthly reporting with cost per customer and next steps",
      ],
    },
    faq: [
      {
        question: {
          el: "Πόσο budget χρειάζομαι;",
          en: "What budget do I need?",
        },
        answer: {
          el: "Εξαρτάται από τον κλάδο και την περιοχή: ένα τοπικό συνεργείο χρειάζεται πολύ λιγότερα από ένα eshop που κυνηγά όλη την Ελλάδα. Ξεκινάμε με ποσό που επιτρέπει να μαζευτούν δεδομένα μέσα σε έναν μήνα και το προσαρμόζουμε με βάση το κόστος ανά πελάτη.",
          en: "It depends on sector and area: a local garage needs far less than an e-shop chasing the whole country. We start with enough to gather data within a month, then adjust against cost per customer.",
        },
      },
      {
        question: {
          el: "Google Ads ή Instagram/Facebook;",
          en: "Google Ads or Instagram/Facebook?",
        },
        answer: {
          el: "Η Google πιάνει ζήτηση που υπάρχει ήδη — κάποιος ψάχνει αυτό που πουλάς τώρα. Το Meta δημιουργεί ζήτηση και χτίζει αναγνωρισιμότητα. Αν το προϊόν σου το ψάχνουν, ξεκινάμε από Google.",
          en: "Google captures demand that already exists — someone is searching for what you sell right now. Meta creates demand and builds awareness. If people search for your product, we start with Google.",
        },
      },
      {
        question: {
          el: "Δεσμεύομαι με συμβόλαιο;",
          en: "Am I locked into a contract?",
        },
        answer: {
          el: "Όχι. Η διαχείριση είναι μηνιαία και μπορείς να σταματήσεις όποτε θες. Οι λογαριασμοί διαφήμισης ανοίγονται στο όνομά σου, οπότε τα δεδομένα και το ιστορικό μένουν δικά σου.",
          en: "No. Management is monthly and you can stop whenever you like. Ad accounts are opened in your name, so the data and history stay yours.",
        },
      },
      {
        question: {
          el: "Αναλαμβάνετε και το περιεχόμενο;",
          en: "Do you handle the creative too?",
        },
        answer: {
          el: "Ναι — κείμενα, εικαστικά και παραλλαγές για δοκιμές. Αν έχεις φωτογραφικό υλικό, το αξιοποιούμε· αν όχι, το φτιάχνουμε.",
          en: "Yes — copy, visuals and variants for testing. If you have photography we use it; if not, we produce it.",
        },
      },
    ],
    projectSlugs: ["wheel-way", "figata", "poseidon-transfers"],
  },
  {
    key: "customSoftware",
    icon: Code,
    slug: { el: "custom-software", en: "custom-software" },
    h1: {
      el: "Ανάπτυξη Λογισμικού",
      en: "Custom Software Development",
    },
    metaTitle: {
      el: "Ανάπτυξη Custom Λογισμικού",
      en: "Custom Software Development",
    },
    metaDescription: {
      el: "Custom λογισμικό για επιχειρήσεις: εσωτερικά εργαλεία, πλατφόρμες πελατών, συνδέσεις μεταξύ συστημάτων. Φτιαγμένο γύρω από τον τρόπο που δουλεύεις.",
      en: "Custom software for business: internal tools, customer platforms and integrations between systems — built around how you actually work.",
    },
    intro: {
      el: "Κάποια στιγμή κάθε επιχείρηση που μεγαλώνει φτάνει στο όριο των έτοιμων προγραμμάτων: πληρώνει για δέκα λειτουργίες που δεν χρησιμοποιεί και της λείπει η μία που χρειάζεται. Εκεί αξίζει το δικό σου λογισμικό.",
      en: "Every growing business eventually hits the limit of off-the-shelf tools: paying for ten features it never uses while missing the one it needs. That is where custom software earns its cost.",
    },
    sections: [
      {
        heading: {
          el: "Το λογισμικό προσαρμόζεται σε εσένα",
          en: "The software adapts to you",
        },
        body: {
          el: "Δεν αλλάζεις τη διαδικασία σου για να ταιριάξει σε ένα πρόγραμμα. Καταγράφουμε πώς δουλεύει πραγματικά η επιχείρηση — με τις εξαιρέσεις και τις ιδιαιτερότητές της — και χτίζουμε γύρω από αυτό.",
          en: "You do not reshape your process to fit a product. We document how the business actually runs — exceptions and quirks included — and build around that.",
        },
      },
      {
        heading: {
          el: "Μία πηγή αλήθειας",
          en: "One source of truth",
        },
        body: {
          el: "Όταν τα ίδια δεδομένα ζουν σε τρία excel, δύο εφαρμογές και ένα τετράδιο, κάποιο είναι πάντα λάθος. Ενοποιούμε τα δεδομένα σε ένα σύστημα με ιστορικό αλλαγών, δικαιώματα και αντίγραφα ασφαλείας.",
          en: "When the same data lives in three spreadsheets, two apps and a notebook, one of them is always wrong. We consolidate it into one system with change history, permissions and backups.",
        },
      },
      {
        heading: {
          el: "Χτισμένο για να συντηρείται",
          en: "Built to be maintained",
        },
        body: {
          el: "Γράφουμε TypeScript με τεκμηρίωση και καθαρή δομή, ώστε το σύστημα να μπορεί να το συνεχίσει και άλλος developer αν χρειαστεί. Δεν φτιάχνουμε κουτιά που ανοίγουμε μόνο εμείς.",
          en: "We write documented, cleanly structured TypeScript so another developer could pick the system up if they had to. We do not build boxes only we can open.",
        },
      },
    ],
    deliverables: {
      el: [
        "Καταγραφή απαιτήσεων και τεχνική προμελέτη",
        "Εσωτερικά εργαλεία, πλατφόρμες πελατών ή portals",
        "Συνδέσεις (APIs) με τα υπάρχοντα συστήματά σου",
        "Μεταφορά δεδομένων από excel και παλιά προγράμματα",
        "Τεκμηρίωση, εκπαίδευση χρηστών και παράδοση κώδικα",
        "Φιλοξενία, παρακολούθηση και συνεχής υποστήριξη",
      ],
      en: [
        "Requirements capture and a technical outline",
        "Internal tools, customer platforms or portals",
        "API integrations with the systems you already run",
        "Data migration out of spreadsheets and legacy tools",
        "Documentation, user training and code handover",
        "Hosting, monitoring and ongoing support",
      ],
    },
    faq: [
      {
        question: {
          el: "Πότε αξίζει custom λογισμικό αντί για έτοιμο;",
          en: "When is custom worth it over off-the-shelf?",
        },
        answer: {
          el: "Όταν πληρώνεις συνδρομές για εργαλεία που καλύπτουν το μισό πρόβλημα, όταν η ομάδα χάνει ώρες σε χειροκίνητες γέφυρες μεταξύ προγραμμάτων, ή όταν η διαδικασία σου είναι ανταγωνιστικό πλεονέκτημα και δεν χωράει σε τυποποιημένο πρόγραμμα.",
          en: "When you pay subscriptions for tools that solve half the problem, when the team loses hours manually bridging systems, or when your process is a competitive advantage that a standard product cannot express.",
        },
      },
      {
        question: {
          el: "Πώς τιμολογείται ένα τέτοιο έργο;",
          en: "How is a project like this priced?",
        },
        answer: {
          el: "Σε φάσεις. Πρώτα μια σύντομη, αμειβόμενη προμελέτη που καταλήγει σε σαφές αντικείμενο και σταθερή τιμή για την πρώτη έκδοση. Έτσι κανείς δεν υπογράφει στα τυφλά.",
          en: "In phases. A short paid discovery first, ending in a defined scope and a fixed price for the first version — so nobody signs blind.",
        },
      },
      {
        question: {
          el: "Τι γίνεται αν αλλάξουν οι ανάγκες μου;",
          en: "What if my needs change?",
        },
        answer: {
          el: "Αυτό είναι το νόημα του custom. Το σύστημα χτίζεται σε κομμάτια ώστε να προστίθενται λειτουργίες χωρίς να ξαναγράφεται το σύνολο.",
          en: "That is the point of custom. The system is built in parts so features can be added without rewriting the whole thing.",
        },
      },
      {
        question: {
          el: "Ποιος φιλοξενεί το σύστημα;",
          en: "Who hosts the system?",
        },
        answer: {
          el: "Συνήθως σε σύγχρονη cloud υποδομή με αντίγραφα ασφαλείας και παρακολούθηση, σε λογαριασμούς στο όνομά σου. Αν η πολιτική σου απαιτεί δικούς σου servers, γίνεται και αυτό.",
          en: "Usually on modern cloud infrastructure with backups and monitoring, in accounts under your name. If your policy requires your own servers, that works too.",
        },
      },
    ],
    projectSlugs: ["orderoo", "kratisix", "moiss-defense-systems"],
  },
  {
    key: "support",
    icon: Wrench,
    slug: { el: "syntirisi-istoselidon", en: "website-maintenance" },
    h1: {
      el: "Συντήρηση & Υποστήριξη",
      en: "Maintenance & Support",
    },
    metaTitle: {
      el: "Συντήρηση Ιστοσελίδων & Υποστήριξη",
      en: "Website Maintenance & Support",
    },
    metaDescription: {
      el: "Συντήρηση ιστοσελίδων και eshop: ενημερώσεις ασφαλείας, αντίγραφα ασφαλείας, αλλαγές περιεχομένου και παρακολούθηση διαθεσιμότητας. Με άνθρωπο που απαντά.",
      en: "Website and e-shop maintenance: security updates, backups, content changes and uptime monitoring — with a human who answers.",
    },
    intro: {
      el: "Μια ιστοσελίδα δεν είναι έπιπλο· είναι λογισμικό. Θέλει ενημερώσεις, αντίγραφα ασφαλείας και κάποιον να το προσέχει. Αναλαμβάνουμε τη συντήρηση ώστε να μην ανακαλύψεις το πρόβλημα από τηλέφωνο πελάτη.",
      en: "A website is not furniture; it is software. It needs updates, backups and somebody watching it. We take that on, so you do not discover a problem from a customer's phone call.",
    },
    sections: [
      {
        heading: {
          el: "Παρακολούθηση πριν το δει ο πελάτης σου",
          en: "Monitoring before your customer notices",
        },
        body: {
          el: "Ελέγχουμε συνεχώς διαθεσιμότητα, ταχύτητα, σφάλματα και λήξη πιστοποιητικών. Αν κάτι πέσει, ειδοποιούμαστε εμείς πρώτοι και συνήθως έχει διορθωθεί πριν το προσέξει κανείς.",
          en: "We continuously check uptime, speed, errors and certificate expiry. If something breaks, we are alerted first and it is usually fixed before anyone notices.",
        },
      },
      {
        heading: {
          el: "Αλλαγές χωρίς αναμονή",
          en: "Changes without the wait",
        },
        body: {
          el: "Νέα τιμή, νέα φωτογραφία, νέο ωράριο, μια σελίδα για την προσφορά του μήνα. Στέλνεις μήνυμα, γίνεται. Χωρίς προσφορά για κάθε μικρή αλλαγή και χωρίς να περιμένεις δύο εβδομάδες.",
          en: "New price, new photo, new opening hours, a page for this month's offer. You send a message, it gets done — without a quote for every small change and without a two-week wait.",
        },
      },
      {
        heading: {
          el: "Ασφάλεια και αντίγραφα που δοκιμάζονται",
          en: "Security and backups that are actually tested",
        },
        body: {
          el: "Ενημερώσεις εξαρτήσεων, έλεγχοι ασφαλείας και αντίγραφα που πράγματι επαναφέρονται όταν χρειαστεί. Ένα backup που δεν έχει δοκιμαστεί δεν είναι backup.",
          en: "Dependency updates, security checks and backups that genuinely restore when needed. A backup nobody has tested is not a backup.",
        },
      },
    ],
    deliverables: {
      el: [
        "Παρακολούθηση διαθεσιμότητας και ειδοποιήσεις 24/7",
        "Ενημερώσεις ασφαλείας και εξαρτήσεων",
        "Αυτόματα αντίγραφα ασφαλείας με δοκιμή επαναφοράς",
        "Αλλαγές περιεχομένου και μικρές βελτιώσεις κάθε μήνα",
        "Ανανέωση SSL και διαχείριση domain",
        "Μηνιαία αναφορά ταχύτητας και επισκεψιμότητας",
      ],
      en: [
        "24/7 uptime monitoring and alerting",
        "Security and dependency updates",
        "Automated backups with restore testing",
        "Content changes and small improvements each month",
        "SSL renewal and domain management",
        "Monthly speed and traffic reporting",
      ],
    },
    faq: [
      {
        question: {
          el: "Είναι υποχρεωτική η συντήρηση;",
          en: "Is maintenance compulsory?",
        },
        answer: {
          el: "Όχι. Το site είναι δικό σου και λειτουργεί χωρίς εμάς. Η συντήρηση υπάρχει για να μην χρειάζεται να το σκέφτεσαι εσύ.",
          en: "No. The site is yours and runs without us. Maintenance exists so you do not have to think about it.",
        },
      },
      {
        question: {
          el: "Αναλαμβάνετε site που έφτιαξε άλλος;",
          en: "Do you take over sites built by someone else?",
        },
        answer: {
          el: "Ναι, μετά από τεχνικό έλεγχο. Αν το site είναι σε κατάσταση που η συντήρηση θα κοστίζει περισσότερο από μια ανακατασκευή, θα στο πούμε ευθέως.",
          en: "Yes, after a technical review. If the site is in a state where maintaining it costs more than rebuilding it, we will say so plainly.",
        },
      },
      {
        question: {
          el: "Πόσο γρήγορα απαντάτε;",
          en: "How fast do you respond?",
        },
        answer: {
          el: "Για θέματα που ρίχνουν το site, άμεσα. Για αλλαγές περιεχομένου, εντός μίας εργάσιμης. Μιλάς με τον άνθρωπο που έφτιαξε το site σου, όχι με σύστημα εισιτηρίων.",
          en: "For anything that takes the site down, immediately. For content changes, within one working day. You talk to the person who built your site, not a ticket queue.",
        },
      },
      {
        question: {
          el: "Περιλαμβάνεται η φιλοξενία;",
          en: "Is hosting included?",
        },
        answer: {
          el: "Ναι, για τα περισσότερα site. Φιλοξενούνται σε υποδομή με παγκόσμιο CDN, οπότε δεν πληρώνεις ξεχωριστό πάροχο hosting.",
          en: "Yes, for most sites. They are hosted on infrastructure with a global CDN, so there is no separate hosting bill.",
        },
      },
    ],
    projectSlugs: ["iatriki-apokatastasi", "epityxein", "viliotis-ilias-accountant"],
  },
  {
    key: "digitalCards",
    icon: Nfc,
    slug: { el: "psifiakes-kartes", en: "digital-business-cards" },
    h1: {
      el: "Ψηφιακές Επαγγελματικές Κάρτες NFC",
      en: "NFC Digital Business Cards",
    },
    metaTitle: {
      el: "Ψηφιακή Επαγγελματική Κάρτα NFC",
      en: "NFC Digital Business Cards",
    },
    metaDescription: {
      el: "Ψηφιακή επαγγελματική κάρτα με NFC και QR: ο συνομιλητής σου ακουμπά το κινητό και σε αποθηκεύει στις επαφές. Στα χρώματα του brand σου, χωρίς εφαρμογή.",
      en: "NFC and QR digital business cards: they tap their phone and you are in their contacts. In your brand colours, with no app to install.",
    },
    intro: {
      el: "Η χάρτινη κάρτα καταλήγει σε τσέπη και χάνεται στο πλυντήριο. Η ψηφιακή κάρτα ανοίγει με ένα άγγιγμα, αποθηκεύεται στις επαφές με ένα κουμπί και ενημερώνεται όποτε αλλάξει κάτι — χωρίς να ξανατυπώσεις τίποτα.",
      en: "A paper card ends up in a pocket and dies in the wash. A digital card opens with a tap, saves to contacts with one button and updates whenever something changes — with nothing reprinted.",
    },
    sections: [
      {
        heading: {
          el: "Ακουμπάς το κινητό και τελείωσε",
          en: "Tap the phone and you are done",
        },
        body: {
          el: "Το NFC tag λειτουργεί σε κάθε σύγχρονο κινητό χωρίς εφαρμογή: ακουμπάς, ανοίγει η κάρτα σου. Για όσους δεν έχουν NFC υπάρχει QR code που κάνει την ίδια δουλειά. Και τα δύο οδηγούν σε μια σύντομη, δική σου διεύθυνση.",
          en: "The NFC tag works on any modern phone with no app: tap it and your card opens. For phones without NFC there is a QR code that does the same. Both point to a short address of your own.",
        },
      },
      {
        heading: {
          el: "Στα χρώματα και το λογότυπό σου",
          en: "In your colours, with your logo",
        },
        body: {
          el: "Κάθε κάρτα σχεδιάζεται στο χρώμα του brand, με το λογότυπο, τη φωτογραφία, τον τίτλο και τους συνδέσμους που θες — τηλέφωνο, email, διεύθυνση, Instagram, LinkedIn, κράτηση ραντεβού, αξιολογήσεις Google.",
          en: "Each card is designed in your brand colour, with your logo, photo, title and the links you want — phone, email, address, Instagram, LinkedIn, booking, Google reviews.",
        },
      },
      {
        heading: {
          el: "Φτιαγμένη για ταχύτητα",
          en: "Built for speed",
        },
        body: {
          el: "Η κάρτα δημιουργείται στατικά και σερβίρεται από CDN, οπότε ανοίγει ακαριαία ακόμη και με κακό σήμα — τη στιγμή που στέκεστε οι δύο σας και περιμένετε να φορτώσει.",
          en: "Cards are generated statically and served from a CDN, so they open instantly even on bad signal — exactly when the two of you are standing there waiting for it to load.",
        },
      },
    ],
    deliverables: {
      el: [
        "Σχεδιασμός κάρτας στα χρώματα και το λογότυπό σου",
        "Σύντομη σταθερή διεύθυνση, π.χ. hexaigon.gr/card/onoma",
        "NFC tag προγραμματισμένο και έτοιμο για χρήση",
        "QR code για κινητά χωρίς NFC",
        "Αποθήκευση στις επαφές με ένα άγγιγμα (vCard)",
        "Αλλαγές στοιχείων όποτε χρειαστεί, χωρίς επανεκτύπωση",
      ],
      en: [
        "Card design in your brand colours, with your logo",
        "A short permanent address, e.g. hexaigon.gr/card/name",
        "An NFC tag programmed and ready to use",
        "A QR code for phones without NFC",
        "One-tap save to contacts (vCard)",
        "Detail changes whenever you need them, with no reprinting",
      ],
    },
    faq: [
      {
        question: {
          el: "Χρειάζεται εφαρμογή ο άλλος;",
          en: "Does the other person need an app?",
        },
        answer: {
          el: "Όχι. Η κάρτα ανοίγει στον browser του κινητού και η αποθήκευση επαφής γίνεται με το ενσωματωμένο σύστημα του τηλεφώνου, σε iPhone και Android.",
          en: "No. The card opens in the phone's browser and saving the contact uses the phone's built-in system, on both iPhone and Android.",
        },
      },
      {
        question: {
          el: "Μπορώ να αλλάξω τηλέφωνο ή τίτλο αργότερα;",
          en: "Can I change my phone number or title later?",
        },
        answer: {
          el: "Ναι, και η διεύθυνση παραμένει η ίδια — οπότε τα NFC tags που έχεις ήδη μοιράσει συνεχίζουν να δουλεύουν με τα νέα στοιχεία.",
          en: "Yes, and the address stays the same — so the NFC tags you have already handed out keep working with the new details.",
        },
      },
      {
        question: {
          el: "Κάνει για ολόκληρη ομάδα;",
          en: "Does it work for a whole team?",
        },
        answer: {
          el: "Ναι. Κάθε άτομο έχει δική του κάρτα και διεύθυνση, με κοινή εταιρική ταυτότητα. Το κάνουμε ήδη για δικηγορικά γραφεία και καταστήματα.",
          en: "Yes. Each person gets their own card and address under a shared company identity. We already do this for law firms and shops.",
        },
      },
      {
        question: {
          el: "Εμφανίζεται η κάρτα μου στη Google;",
          en: "Will my card show up on Google?",
        },
        answer: {
          el: "Από προεπιλογή όχι — οι κάρτες είναι εργαλείο γνωριμίας, όχι σελίδες αναζήτησης, και μένουν εκτός ευρετηρίου. Αν θέλεις τη δική σου ευρετηριασμένη, γίνεται με μία αλλαγή.",
          en: "By default no — cards are an introduction tool, not search pages, so they stay out of the index. If you want yours indexed, it is a one-line change.",
        },
      },
    ],
    projectSlugs: [],
  },
];

/** Hub-page order and homepage grid order. Nine entries keep the 3×3 grid full. */
export const getServiceBySlug = (slug: string, locale: string): Service | undefined =>
  SERVICES.find((service) =>
    Object.values(service.slug).includes(slug)
      ? // A slug is only valid on the locale that owns it, so /en/services/
        // kataskevi-eshop 404s instead of rendering an English page at a Greek URL.
        service.slug[locale as keyof Service["slug"]] === slug
      : false
  );

import { pick } from "@/lib/i18n/localized";

/** Route for a service page in one locale, without the locale prefix. */
export const servicePath = (service: Service, locale: string) =>
  `/services/${pick(service.slug, locale)}`;

/** The same route in every locale — what hreflang and the sitemap need. */
export const servicePaths = (service: Service): Localized<string> => ({
  el: `/services/${service.slug.el}`,
  en: `/services/${service.slug.en}`,
});

export const getServicesByKeys = (keys: string[]): Service[] =>
  keys
    .map((key) => SERVICES.find((service) => service.key === key))
    .filter((service): service is Service => Boolean(service));
