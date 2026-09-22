import type { Localized } from "@/lib/i18n/localized";

/**
 * The portfolio, and the source of every case-study page.
 *
 * Copy is localized here rather than in `messages/*.json` for the same reason as
 * the service catalogue: a project's blurb, sector, location and feature list
 * are one unit and have to move together. Everything in `highlights` was checked
 * against the live site — no invented metrics, no features nobody shipped.
 */
export type Project = {
  slug: string;
  title: string;
  /** One-line blurb on the portfolio card. */
  description: Localized<string>;
  /** Sector, used in the H1 and the meta title: "Κατασκευή ιστοσελίδας για ...". */
  category: Localized<string>;
  location?: Localized<string>;
  /** Lead paragraph of the case study. */
  summary: Localized<string>;
  /** What the site actually does. Verified against the live site. */
  highlights: Localized<string[]>;
  /** `SERVICES[].key` values this project is proof of. Drives internal links. */
  serviceKeys: string[];
  desktopImage?: string;
  mobileImage: string;
  /** Composited device-mockup shot (scripts/mockup/composite.py) */
  mockupImage?: string;
  url: string;
  /**
   * `false` when the deployment is down. The card and the case study then stop
   * linking out, so the portfolio never points a visitor — or a crawler — at a
   * 404. Flip it back once the site is redeployed.
   */
  live?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "orderoo",
    title: "Orderoo",
    description: {
      el: "Πλατφόρμα online παραγγελιών με 0% προμήθεια",
      en: "Direct ordering platform for local shops, 0% commission",
    },
    category: {
      el: "Πλατφόρμα online παραγγελιών",
      en: "Online ordering platform",
    },
    location: { el: "Ηλιούπολη, Αθήνα", en: "Ilioupoli, Athens" },
    summary: {
      el: "Το Orderoo δίνει σε τοπικά καταστήματα δικό τους κανάλι παραγγελιών, με το brand τους και χωρίς ποσοστό σε πλατφόρμα delivery. Ο πελάτης παραγγέλνει απευθείας, τα χρήματα πάνε στο κατάστημα και τα δεδομένα των πελατών μένουν στην επιχείρηση.",
      en: "Orderoo gives local shops their own ordering channel, under their own brand and without handing a delivery platform a cut. Customers order directly, the money goes to the shop, and the customer data stays with the business.",
    },
    highlights: {
      el: [
        "Παραγγελία με delivery ή παραλαβή από το κατάστημα",
        "Branded εφαρμογή (PWA) για κινητό και υπολογιστή",
        "Πίνακας διαχείρισης παραγγελιών σε πραγματικό χρόνο",
        "Ενσωματωμένο σύστημα πιστότητας και εκπτωτικών κουπονιών",
        "Πληρωμές μέσω Stripe και αναφορές πωλήσεων",
      ],
      en: [
        "Delivery or in-store pickup ordering",
        "Branded progressive web app for phone and desktop",
        "Real-time order management board",
        "Built-in loyalty scheme and discount coupons",
        "Stripe payments and sales reporting",
      ],
    },
    serviceKeys: ["eshop", "webApps", "customSoftware"],
    desktopImage: "/projects/orderoo-desktop.png",
    mobileImage: "/projects/orderoo-mobile.png",
    mockupImage: "/projects/orderoo-mockup.png",
    url: "https://orderoo.gr",
  },
  {
    slug: "kratisix",
    title: "Kratisix",
    description: {
      el: "Πλατφόρμα online κρατήσεων για επιχειρήσεις με ραντεβού",
      en: "Online appointment booking platform",
    },
    category: {
      el: "Πλατφόρμα κρατήσεων ραντεβού",
      en: "Appointment booking platform",
    },
    summary: {
      el: "Πλατφόρμα κρατήσεων για επιχειρήσεις υπηρεσιών: ο πελάτης κλείνει ραντεβού μόνος του, όποια ώρα, και το ημερολόγιο γεμίζει χωρίς τηλέφωνα. Καλύπτει έξι κλάδους, από κομμωτήρια και ιατρεία μέχρι γυμναστήρια και εκπαίδευση.",
      en: "A booking platform for service businesses: customers book themselves, at any hour, and the calendar fills without a phone ringing. It covers six verticals, from salons and clinics to gyms and education.",
    },
    highlights: {
      el: [
        "Online κρατήσεις 24 ώρες το 24ωρο",
        "Αυτόματες υπενθυμίσεις ραντεβού με email",
        "Διαχείριση προσωπικού, χώρων και διαθεσιμότητας",
        "Στατιστικά και αναφορές για την επιχείρηση",
        "Πολύγλωσσο περιβάλλον και πλήρης λειτουργία σε κινητό",
      ],
      en: [
        "Round-the-clock online booking",
        "Automated email appointment reminders",
        "Staff, resource and availability management",
        "Business analytics and reporting",
        "Multi-language interface, fully usable on mobile",
      ],
    },
    serviceKeys: ["webApps", "customSoftware", "automations"],
    desktopImage: "/projects/kratisix-desktop.png",
    mobileImage: "/projects/kratisix-mobile.png",
    mockupImage: "/projects/kratisix-mockup.png",
    url: "https://www.kratisix.com/en",
  },
  {
    slug: "salsa-rayo",
    title: "Salsa Rayo",
    description: {
      el: "Ιστοσελίδα για σχολή salsa και bachata",
      en: "Website for salsa and bachata classes",
    },
    category: { el: "Σχολή χορού", en: "Dance school" },
    location: { el: "Άγιος Δημήτριος, Αθήνα", en: "Agios Dimitrios, Athens" },
    summary: {
      el: "Σχολή salsa On2 και bachata στον Άγιο Δημήτριο. Το site δείχνει καθαρά το εβδομαδιαίο πρόγραμμα, τα επίπεδα και τα πακέτα συνδρομών, ώστε ο νέος μαθητής να καταλαβαίνει σε ένα λεπτό πού και πότε θα ξεκινήσει.",
      en: "A New York style salsa (On2) and bachata school in Agios Dimitrios. The site lays out the weekly schedule, the levels and the monthly packages so a new student can see in a minute where and when to start.",
    },
    highlights: {
      el: [
        "Εβδομαδιαίο πρόγραμμα μαθημάτων ανά επίπεδο",
        "Προφίλ δασκάλων και παρουσίαση των στυλ",
        "Μηνιαία πακέτα με τιμές και δωρεάν δοκιμαστικό μάθημα",
        "Φόρμα επικοινωνίας και χάρτης Google",
        "Μαρτυρίες μαθητών, άρθρα και σύνδεση με Instagram, YouTube, Spotify",
      ],
      en: [
        "Weekly class schedule by level",
        "Instructor profiles and an introduction to each style",
        "Monthly packages with prices and a free trial class",
        "Contact form and Google Maps",
        "Student testimonials, articles and Instagram, YouTube, Spotify links",
      ],
    },
    serviceKeys: ["websites", "webApps"],
    desktopImage: "/projects/salsa-rayo-desktop.png",
    mobileImage: "/projects/salsa-rayo-mobile.png",
    mockupImage: "/projects/salsa-rayo-mockup.png",
    url: "https://salsarayo.com/",
  },
  {
    slug: "poseidon-transfers",
    title: "Poseidon Transfers",
    description: {
      el: "Ιστοσελίδα με κρατήσεις για VIP μεταφορές",
      en: "Website for luxury transfers in Greece",
    },
    category: { el: "VIP μεταφορές & ιδιωτικές εκδρομές", en: "Luxury transfers & private tours" },
    location: { el: "Αθήνα", en: "Athens" },
    summary: {
      el: "Εταιρεία ιδιωτικών μεταφορών και ξεναγήσεων με δεκαετή παρουσία στην Αθήνα. Το site απευθύνεται σε ταξιδιώτες από το εξωτερικό, οπότε η φόρμα κράτησης βρίσκεται στην αρχική και η επικοινωνία γίνεται και μέσω WhatsApp.",
      en: "A private transfer and guided tour company with ten years in Athens. The site speaks to travellers arriving from abroad, so the booking form sits on the homepage and WhatsApp is a first-class contact route.",
    },
    highlights: {
      el: [
        "Φόρμα κράτησης διαδρομής απευθείας στην αρχική σελίδα",
        "Πέντε κατηγορίες οχημάτων, από 3 έως 16 επιβάτες",
        "Επικοινωνία με τηλέφωνο, email και WhatsApp, 24/7",
        "Αγγλόφωνο περιεχόμενο για ταξιδιώτες από το εξωτερικό",
        "Παρουσίαση διαδρομών και ιδιωτικών εκδρομών",
      ],
      en: [
        "Journey booking form directly on the homepage",
        "Five vehicle classes, from 3 to 16 passengers",
        "Phone, email and WhatsApp contact, 24/7",
        "English-language content for international travellers",
        "Route and private tour presentation",
      ],
    },
    serviceKeys: ["websites", "ads"],
    desktopImage: "/projects/poseidon-transfers-desktop.png",
    mobileImage: "/projects/poseidon-transfers-mobile.png",
    mockupImage: "/projects/poseidon-transfers-mockup.png",
    url: "https://poseidontranfer.vercel.app/en-US",
  },
  {
    slug: "moisis-flower-design",
    title: "MOISIS Flower Design",
    description: {
      el: "Ιστοσελίδα για boutique ανθοπωλείο στην Ηλιούπολη",
      en: "Website for a luxury florist in Ilioupoli",
    },
    category: { el: "Ανθοπωλείο", en: "Florist" },
    location: { el: "Ηλιούπολη, Αθήνα", en: "Ilioupoli, Athens" },
    summary: {
      el: "Ανθοπωλείο πολυτελείας στη Λεωφόρο Δημοκρατίας. Το site δουλεύει σαν βιτρίνα και σαν κατάλογος ταυτόχρονα: από μπουκέτα και forever roses μέχρι στολισμούς γάμου και βάπτισης, με παραγγελία σε λίγα βήματα.",
      en: "A luxury florist on Leoforos Dimokratias. The site works as a shop window and a catalogue at once: from bouquets and forever roses to wedding and christening styling, with ordering a few steps away.",
    },
    highlights: {
      el: [
        "Κατάλογος με μπουκέτα, forever roses, ορχιδέες και φυτά",
        "Ενότητες για γάμους, βαπτίσεις και στολισμό εκδηλώσεων",
        "Online παραγγελία μέσω Wolt απευθείας από τη σελίδα",
        "Γκαλερί συνθέσεων και αξιολογήσεις Google (4.9/5)",
        "Δίγλωσσο περιεχόμενο, ελληνικά και αγγλικά",
      ],
      en: [
        "Catalogue of bouquets, forever roses, orchids and plants",
        "Sections for weddings, christenings and event styling",
        "Online ordering through Wolt straight from the page",
        "Arrangement gallery and Google reviews (4.9/5)",
        "Bilingual content, Greek and English",
      ],
    },
    serviceKeys: ["websites", "seoAeo"],
    desktopImage: "/projects/moisis-flower-design-desktop.png",
    mobileImage: "/projects/moisis-flower-design-mobile.png",
    mockupImage: "/projects/moisis-flower-design-mockup.png",
    url: "https://www.moisis-flower-design.gr",
  },
  {
    slug: "1-percent-club",
    title: "1 Percent Club",
    description: {
      el: "Online παιχνίδι ερωτήσεων με κλιμακούμενη δυσκολία",
      en: "Game for progressive difficulty trivia",
    },
    category: { el: "Online παιχνίδι γνώσεων", en: "Online quiz game" },
    summary: {
      el: "Παιχνίδι ερωτήσεων που ξεκινά από ερωτήσεις τις οποίες απαντά το 90% και καταλήγει σε αυτές που περνά μόνο το 1%. Χτίστηκε ως web εφαρμογή, οπότε παίζεται σε κάθε συσκευή χωρίς εγκατάσταση.",
      en: "A quiz that starts with questions 90% of people get right and ends with the ones only 1% survive. Built as a web app, so it plays on any device with nothing to install.",
    },
    highlights: {
      el: [
        "Κλιμακούμενη δυσκολία από το 90% έως το 1%",
        "Λογαριασμοί παικτών και παρακολούθηση προόδου",
        "Πολύγλωσσες εκδόσεις ερωτήσεων",
        "Παίζεται σε κινητό και υπολογιστή χωρίς εγκατάσταση",
      ],
      en: [
        "Difficulty that escalates from 90% down to 1%",
        "Player accounts and mastery tracking",
        "Multi-language question editions",
        "Plays on phone and desktop with no install",
      ],
    },
    serviceKeys: ["webApps"],
    desktopImage: "/projects/1-percent-club-desktop.png",
    mobileImage: "/projects/1-percent-club-mobile.png",
    mockupImage: "/projects/1-percent-club-mockup.png",
    url: "https://1-percent-club-six.vercel.app/en",
  },
  {
    slug: "4yournails",
    title: "4 Your Nails",
    description: {
      el: "Ιστοσελίδα για βραβευμένο studio νυχιών",
      en: "Website for an award-winning nail care salon",
    },
    category: { el: "Studio νυχιών & φρυδιών", en: "Nail & eyebrow salon" },
    location: { el: "Ηλιούπολη, Αθήνα", en: "Ilioupoli, Athens" },
    summary: {
      el: "Studio νυχιών και φρυδιών στη Λεωφόρο Σοφοκλή Βενιζέλου. Ο κατάλογος ξεπερνά τις 38 θεραπείες, οπότε το site οργανώνει τα πάντα σε καθαρές κατηγορίες και οδηγεί σε ένα πράγμα: κλείσιμο ραντεβού.",
      en: "A nail and eyebrow studio on Leoforos Sofokli Venizelou. The menu runs past 38 treatments, so the site organises everything into clean categories and drives one action: booking.",
    },
    highlights: {
      el: [
        "Πάνω από 38 θεραπείες σε κατηγορίες: manicure, pedicure, nail art, αποτρίχωση, microblading",
        "Κουμπί «Κλείσε Ραντεβού» σε κάθε οθόνη",
        "Γκαλερί σχεδίων και αξιολογήσεις πελατών (4.8+)",
        "Φόρμα επικοινωνίας, ωράριο και χάρτης Google",
        "Δίγλωσσο περιεχόμενο και σύνδεση με Instagram και Facebook",
      ],
      en: [
        "38+ treatments grouped into manicure, pedicure, nail art, waxing and microblading",
        "A \"book now\" button on every screen",
        "Design gallery and customer reviews (4.8+)",
        "Contact form, opening hours and Google Maps",
        "Bilingual content with Instagram and Facebook links",
      ],
    },
    serviceKeys: ["websites", "seoAeo"],
    desktopImage: "/projects/4yournails-desktop.png",
    mobileImage: "/projects/4yournails-mobile.png",
    mockupImage: "/projects/4yournails-mockup.png",
    url: "https://www.4yournails.gr",
  },
  {
    slug: "wheel-way",
    title: "Wheel Way",
    description: {
      el: "Ιστοσελίδα για πώληση αυτοκινήτων και τροχόσπιτων",
      en: "Website for a used car and motorhome dealer",
    },
    category: {
      el: "Πώληση μεταχειρισμένων αυτοκινήτων & τροχόσπιτων",
      en: "Used car & motorhome dealership",
    },
    location: { el: "Ραφήνα, Αττική", en: "Rafina, Attica" },
    summary: {
      el: "Έμπορος μεταχειρισμένων αυτοκινήτων και τροχόσπιτων που δουλεύει χωρίς έκθεση, κρατώντας χαμηλά το κόστος. Το site είναι η έκθεση: κάθε όχημα με φωτογραφίες, χαρακτηριστικά και τιμή, και ένα κουμπί WhatsApp δίπλα του.",
      en: "A used car and motorhome dealer that operates without showroom overhead. The site is the showroom: every vehicle with photos, specs and price, and a WhatsApp button next to it.",
    },
    highlights: {
      el: [
        "Αγγελίες οχημάτων με φωτογραφίες, χιλιόμετρα, καύσιμο και τιμή",
        "Άμεση επικοινωνία μέσω WhatsApp για κάθε όχημα",
        "Τεχνικός έλεγχος πριν την πώληση και κλείσιμο ραντεβού",
        "Ενότητα συχνών ερωτήσεων για εγγύηση και παράδοση",
        "Αγγλική έκδοση και σύνδεση με το συνεργείο Antoniadis Auto Service",
      ],
      en: [
        "Vehicle listings with photos, mileage, fuel type and price",
        "Direct WhatsApp contact on every vehicle",
        "Pre-sale technical inspection and appointment booking",
        "FAQ section covering warranty and delivery",
        "English version and a link to Antoniadis Auto Service",
      ],
    },
    serviceKeys: ["websites", "ads"],
    desktopImage: "/projects/wheel-way-desktop.png",
    mobileImage: "/projects/wheel-way-mobile.png",
    mockupImage: "/projects/wheel-way-mockup.png",
    url: "https://wheel-way.gr",
  },
  {
    slug: "viliotis-ilias-accountant",
    title: "Viliotis Ilias Accountant",
    description: {
      el: "Ιστοσελίδα για λογιστικό & φοροτεχνικό γραφείο",
      en: "Website for an accounting and tax services firm",
    },
    category: { el: "Λογιστικό & φοροτεχνικό γραφείο", en: "Accounting & tax firm" },
    location: { el: "Μελίσσια, Αθήνα", en: "Melissia, Athens" },
    summary: {
      el: "Λογιστικό γραφείο με παρουσία από το 1993. Το site εξηγεί με απλά λόγια ποιες δηλώσεις και διαδικασίες αναλαμβάνει, και κρατά τον επισκέπτη ενήμερο με ζωντανή ροή ανακοινώσεων της ΑΑΔΕ.",
      en: "An accounting practice operating since 1993. The site explains in plain language which filings and procedures it handles, and keeps visitors current with a live feed of Greek tax authority announcements.",
    },
    highlights: {
      el: [
        "Υπηρεσίες: τήρηση βιβλίων, δηλώσεις Ε1/Ε2/Ε9, ΦΠΑ, μισθοδοσία, ΕΡΓΑΝΗ",
        "Ζωντανή ροή δελτίων τύπου της ΑΑΔΕ",
        "Φόρμα επικοινωνίας και κλείσιμο ραντεβού",
        "Χάρτης Google με τη θέση του γραφείου",
        "Δίγλωσσο περιεχόμενο, ελληνικά και αγγλικά",
      ],
      en: [
        "Services: bookkeeping, E1/E2/E9 returns, VAT, payroll, ERGANI filings",
        "Live feed of Greek tax authority press releases",
        "Contact form and appointment booking",
        "Google Maps with the office location",
        "Bilingual content, Greek and English",
      ],
    },
    serviceKeys: ["websites", "support"],
    desktopImage: "/projects/viliotis-ilias-accountant-desktop.png",
    mobileImage: "/projects/viliotis-ilias-accountant-mobile.png",
    mockupImage: "/projects/viliotis-ilias-accountant-mockup.png",
    url: "https://viliotis-ilias-accountant.vercel.app/",
  },
  {
    slug: "iatriki-apokatastasi",
    title: "Iatriki Apokatastasi",
    description: {
      el: "Ιστοσελίδα για ιατρείο φυσικής ιατρικής & αποκατάστασης",
      en: "Website for medical rehabilitation services",
    },
    category: { el: "Ιατρείο φυσικής ιατρικής & αποκατάστασης", en: "Physical medicine & rehabilitation clinic" },
    location: { el: "Ηλιούπολη, Αθήνα", en: "Ilioupoli, Athens" },
    summary: {
      el: "Ιατρείο αποκατάστασης μυοσκελετικού πόνου στην Ανδρούτσου. Το site είναι γραμμένο γύρω από το σύμπτωμα — οσφυαλγία, αυχενικό, πόνος στο γόνατο — γιατί έτσι ψάχνει ο ασθενής, και καταλήγει σε φόρμα ραντεβού.",
      en: "A musculoskeletal pain and rehabilitation clinic on Androutsou street. The site is written around the symptom — lower back, neck, knee pain — because that is how patients search, and it ends in a booking form.",
    },
    highlights: {
      el: [
        "Υπηρεσίες: φυσικοθεραπεία, θεραπευτική άσκηση, κρουστικοί υπέρηχοι, μαγνητική διέγερση, ιατρικός βελονισμός",
        "Σελίδες ανά πάθηση, γραμμένες στη γλώσσα του ασθενούς",
        "Online φόρμα ραντεβού και τηλέφωνο σε κάθε οθόνη",
        "Βιογραφικό και εξειδίκευση του ιατρού, μαρτυρίες ασθενών",
        "Ενότητα συχνών ερωτήσεων και φωτογραφίες του χώρου",
      ],
      en: [
        "Services: physiotherapy, therapeutic exercise, shockwave therapy, magnetic stimulation, medical acupuncture",
        "A page per condition, written in the patient's language",
        "Online booking form and phone number on every screen",
        "Doctor's background and credentials, patient testimonials",
        "FAQ section and photos of the clinic",
      ],
    },
    serviceKeys: ["websites", "seoAeo", "support"],
    desktopImage: "/projects/iatriki-apokatastasi-desktop.png",
    mobileImage: "/projects/iatriki-apokatastasi-mobile.png",
    mockupImage: "/projects/iatriki-apokatastasi-mockup.png",
    url: "https://www.iatriki-apokatastasi.gr",
  },
  {
    slug: "anthopolio-kaloudhs",
    title: "Anthopolio Kaloudhs",
    description: {
      el: "Ιστοσελίδα για ανθοπωλείο και υπηρεσίες κηποτεχνίας",
      en: "Website for a flower shop and garden services",
    },
    category: { el: "Ανθοπωλείο & κηποτεχνία", en: "Florist & landscaping" },
    location: { el: "Ηλιούπολη, Αθήνα", en: "Ilioupoli, Athens" },
    summary: {
      el: "Ανθοπωλείο με υπηρεσίες κηποτεχνίας στην Ηλιούπολη. Το site καλύπτει δύο κοινά ταυτόχρονα — αυτόν που θέλει ένα μπουκέτο σήμερα και αυτόν που ψάχνει στολισμό ή συντήρηση κήπου — χωρίς να μπερδεύει κανέναν.",
      en: "A florist that also does landscaping, in Ilioupoli. The site serves two audiences at once — someone who wants a bouquet today, and someone planning event styling or garden maintenance — without confusing either.",
    },
    highlights: {
      el: [
        "Κατάλογος με κομμένα άνθη, φυτά, forever roses και rose bears",
        "Online παραγγελία μέσω Wolt με τιμές ανά προϊόν",
        "Υπηρεσίες γάμων, βαπτίσεων και συντήρησης κήπων",
        "Επικοινωνία με τηλέφωνο, WhatsApp, email και φόρμα",
        "Δίγλωσσο περιεχόμενο, ελληνικά και αγγλικά",
      ],
      en: [
        "Catalogue of cut flowers, plants, forever roses and rose bears",
        "Online ordering via Wolt with per-product pricing",
        "Wedding, christening and garden maintenance services",
        "Phone, WhatsApp, email and contact-form enquiries",
        "Bilingual content, Greek and English",
      ],
    },
    serviceKeys: ["websites", "eshop"],
    desktopImage: "/projects/anthopolio-kaloudhs-desktop.png",
    mobileImage: "/projects/anthopolio-kaloudhs-mobile.png",
    mockupImage: "/projects/anthopolio-kaloudhs-mockup.png",
    url: "https://www.anthopoleio-kaloudis.gr/en",
  },
  {
    slug: "iching-balance",
    title: "I Ching: Balance Way",
    description: {
      el: "Ιστοσελίδα για κέντρο ολιστικών θεραπειών",
      en: "Website for holistic Chinese medicine therapies",
    },
    category: { el: "Παραδοσιακή κινεζική ιατρική & ολιστικές θεραπείες", en: "Traditional Chinese medicine & holistic therapies" },
    location: { el: "Άλιμος, Αθήνα", en: "Alimos, Athens" },
    summary: {
      el: "Κέντρο παραδοσιακής κινεζικής ιατρικής στον Άλιμο. Ο στόχος του site ήταν να εξηγήσει θεραπείες που οι περισσότεροι δεν γνωρίζουν, με ήρεμο τόνο και χωρίς υπερβολές, και να οδηγήσει σε αίτημα ραντεβού.",
      en: "A traditional Chinese medicine practice in Alimos. The job of the site was to explain therapies most people have never tried, calmly and without overclaiming, and to lead to an appointment request.",
    },
    highlights: {
      el: [
        "Θεραπείες: βελονισμός, ηλεκτροβελονισμός, βεντούζες, μοξοθεραπεία",
        "Εξατομικευμένα προγράμματα διατροφής και διαχείρισης βάρους",
        "Φόρμα αιτήματος ραντεβού με επιλογή υπηρεσίας και ημερομηνίας",
        "Ωράριο λειτουργίας, τηλέφωνο και τοποθεσία",
        "Καθαρή παρουσίαση κάθε θεραπείας σε ξεχωριστή ενότητα",
      ],
      en: [
        "Therapies: acupuncture, electro-acupuncture, cupping, moxibustion",
        "Personalised nutrition and weight management programmes",
        "Appointment request form with service and preferred date",
        "Opening hours, phone number and location",
        "A clear, separate section explaining each therapy",
      ],
    },
    serviceKeys: ["websites"],
    desktopImage: "/projects/iching-balance-desktop.png",
    mobileImage: "/projects/iching-balance-mobile.png",
    mockupImage: "/projects/iching-balance-mockup.png",
    url: "https://i-ching-v2.vercel.app/",
  },
  {
    slug: "figata",
    title: "Figata",
    description: {
      el: "Ιστοσελίδα για καφέ με ελληνικά σύκα",
      en: "Website for a Greek fig cafe",
    },
    category: { el: "Καφέ & υγιεινή διατροφή", en: "Cafe & healthy food" },
    location: { el: "Βύρωνας, Αθήνα", en: "Vyronas, Athens" },
    summary: {
      el: "Μικρό καφέ στον Βύρωνα με αποξηραμένα σύκα και υγιεινές επιλογές. Το site κρατά το ύφος του μαγαζιού — ζεστό και απλό — και απαντά στα τρία πράγματα που ψάχνει ο επισκέπτης: τι είναι, πού είναι, πότε ανοίγει.",
      en: "A small cafe in Vyronas built on dried figs and healthy eating. The site keeps the shop's warm, simple tone and answers the three things a visitor wants: what it is, where it is, when it opens.",
    },
    highlights: {
      el: [
        "Παρουσίαση της ιστορίας και της φιλοσοφίας του καταστήματος",
        "Γκαλερί φωτογραφιών από τον χώρο και τα προϊόντα",
        "Ωράριο λειτουργίας και σύνδεσμος χάρτη",
        "Φόρμα επικοινωνίας και σύνδεση με Instagram, Facebook, TikTok",
        "Δίγλωσσο περιεχόμενο, ελληνικά και αγγλικά",
      ],
      en: [
        "The shop's story and philosophy, up front",
        "Photo gallery of the space and the products",
        "Opening hours and a map link",
        "Contact form and Instagram, Facebook, TikTok links",
        "Bilingual content, Greek and English",
      ],
    },
    serviceKeys: ["websites", "ads"],
    desktopImage: "/projects/figata-desktop.png",
    mobileImage: "/projects/figata-mobile.png",
    mockupImage: "/projects/figata-mockup.png",
    url: "https://www.figata.gr/en",
  },
  {
    slug: "epityxein",
    title: "Epityxein",
    description: {
      el: "Ιστοσελίδα για φροντιστήριο μέσης εκπαίδευσης",
      en: "Website for a tutoring center in Ilioupoli",
    },
    category: { el: "Φροντιστήριο μέσης εκπαίδευσης", en: "Secondary education tutoring centre" },
    location: { el: "Ηλιούπολη, Αθήνα", en: "Ilioupoli, Athens" },
    summary: {
      el: "Φροντιστήριο στη Σκρα, με τμήματα 5 έως 7 ατόμων και εβδομαδιαία διαγωνίσματα. Το site μιλά σε γονείς που συγκρίνουν φροντιστήρια, οπότε βάζει μπροστά τα μεγέθη τμημάτων, τους καθηγητές και τις επιτυχίες.",
      en: "A tutoring centre on Skra street, with classes of five to seven students and weekly mock exams. The site speaks to parents comparing options, so class sizes, teachers and results lead.",
    },
    highlights: {
      el: [
        "Τμήματα 5–7 μαθητών και εβδομαδιαία διαγωνίσματα",
        "Μαθήματα για όλες τις τάξεις Γυμνασίου και Λυκείου",
        "Σελίδες για φιλοσοφία, καθηγητές και επιτυχίες μαθητών",
        "Πρόγραμμα υποτροφιών και εκπαιδευτικό υλικό των καθηγητών",
        "Φόρμα επικοινωνίας, τηλέφωνο και μαρτυρίες μαθητών",
      ],
      en: [
        "Classes of 5–7 students with weekly practice exams",
        "Courses across all secondary school years",
        "Pages for philosophy, teachers and student results",
        "Scholarship programme and teacher-authored materials",
        "Contact form, phone number and student testimonials",
      ],
    },
    serviceKeys: ["websites", "support"],
    desktopImage: "/projects/epityxein-desktop.png",
    mobileImage: "/projects/epityxein-mobile.png",
    mockupImage: "/projects/epityxein-mockup.png",
    url: "https://epityxein.vercel.app",
  },
  {
    slug: "shuk-athens",
    title: "Shuk Athens",
    description: {
      el: "Ιστοσελίδα για εστιατόριο Μέσης Ανατολής στο κέντρο",
      en: "Website for a Levantine restaurant in central Athens",
    },
    category: { el: "Εστιατόριο Μέσης Ανατολής", en: "Middle Eastern restaurant" },
    location: { el: "Ερμού, Αθήνα", en: "Ermou, Athens" },
    summary: {
      el: "Εστιατόριο Μέσης Ανατολής στην Ερμού 117, σε δρόμο γεμάτο περαστικούς και τουρίστες. Το site φτιάχτηκε για κινητό πρώτα: μενού, κράτηση και τοποθεσία σε δύο κινήσεις, ενώ κάποιος στέκεται στον δρόμο.",
      en: "A Middle Eastern restaurant at Ermou 117, on a street full of passing trade and tourists. The site was built phone-first: menu, reservation and location in two taps, while someone is standing on the pavement.",
    },
    highlights: {
      el: [
        "Online μενού με χούμους, πίτα, φαλάφελ, σαουάρμα και σνίτσελ",
        "Κράτηση τραπεζιού μέσω WhatsApp ή τηλεφώνου",
        "Γκαλερί φωτογραφιών από τα πιάτα και τον χώρο",
        "Μαρτυρίες πελατών και φόρμα επικοινωνίας",
        "Σύνδεση με Instagram και Facebook",
      ],
      en: [
        "Online menu with hummus, pita, falafel, shawarma and schnitzel",
        "Table reservations by WhatsApp or phone",
        "Photo gallery of the food and the room",
        "Customer testimonials and a contact form",
        "Instagram and Facebook integration",
      ],
    },
    serviceKeys: ["websites", "seoAeo"],
    desktopImage: "/projects/shuk-athens-desktop.png",
    mobileImage: "/projects/shuk-athens-mobile.png",
    mockupImage: "/projects/shuk-athens-mockup.png",
    url: "https://www.shukathens.com",
  },
  {
    slug: "stone-massage-athens",
    title: "Stone Massage Athens",
    description: {
      el: "Ιστοσελίδα με online πληρωμές για wellness lounge",
      en: "Website for a boutique massage and wellness spa",
    },
    category: { el: "Μασάζ & wellness", en: "Massage & wellness lounge" },
    location: { el: "Αθήνα", en: "Athens" },
    summary: {
      el: "Wellness lounge στην Παναγή Τσαλδάρη. Κάθε θεραπεία παρουσιάζεται με διάρκεια και τιμή — χωρίς «επικοινωνήστε για τιμοκατάλογο» — και η κράτηση κλείνει με WhatsApp ή online πληρωμή.",
      en: "A wellness lounge on Panagi Tsaldari. Every treatment is listed with its duration and price — no \"contact us for rates\" — and a booking closes over WhatsApp or with an online payment.",
    },
    highlights: {
      el: [
        "Εννέα θεραπείες με διάρκεια και τιμή, από hot stone μέχρι Thai",
        "Κράτηση μέσω WhatsApp και online πληρωμή",
        "Γκαλερί χώρου και αξιολογήσεις πελατών (5.0)",
        "Ωράριο, τηλέφωνο, email και φόρμα επικοινωνίας",
        "Δίγλωσσο περιεχόμενο, ελληνικά και αγγλικά",
      ],
      en: [
        "Nine treatments with duration and price, from hot stone to Thai",
        "WhatsApp booking and online payment",
        "Space gallery and customer reviews (5.0)",
        "Opening hours, phone, email and contact form",
        "Bilingual content, Greek and English",
      ],
    },
    serviceKeys: ["websites", "eshop", "seoAeo"],
    desktopImage: "/projects/stone-massage-athens-desktop.png",
    mobileImage: "/projects/stone-massage-athens-mobile.png",
    mockupImage: "/projects/stone-massage-athens-mockup.png",
    url: "https://stonemassageathens.com",
  },
  {
    slug: "konstantinopoulou-kyparissia",
    title: "Kyparissia Konstantinopoulou",
    description: {
      el: "Ιστοσελίδα για ψυχολόγο και συστημική θεραπεύτρια",
      en: "Website for a psychologist and systemic therapist",
    },
    category: { el: "Ψυχολόγος & συμβουλευτική", en: "Psychologist & counselling" },
    location: { el: "Νέα Πεντέλη, Αττική", en: "Nea Penteli, Attica" },
    summary: {
      el: "Ιδιωτικό γραφείο ψυχολογίας στη Νέα Πεντέλη. Το site έπρεπε να δημιουργεί ασφάλεια πριν καν επικοινωνήσει κάποιος: καθαρή εξήγηση της προσέγγισης, διάρκεια και τρόπος συνεδριών, και απαντήσεις στις ερωτήσεις που δεν τολμά να ρωτήσει κανείς.",
      en: "A private psychology practice in Nea Penteli. The site had to create safety before anyone makes contact: a clear account of the approach, how sessions work, and answers to the questions people hesitate to ask.",
    },
    highlights: {
      el: [
        "Ατομικές συνεδρίες 50 λεπτών, δια ζώσης ή online",
        "Ομαδική θεραπεία, art therapy και βιωματικά εργαστήρια",
        "Κλείσιμο ραντεβού μέσω doctoranytime",
        "Ενότητα συχνών ερωτήσεων, τρόποι πληρωμής και πολιτική ακύρωσης",
        "Δίγλωσσο περιεχόμενο, ελληνικά και αγγλικά",
      ],
      en: [
        "50-minute individual sessions, in person or online",
        "Group therapy, art therapy and experiential workshops",
        "Booking through doctoranytime",
        "FAQ section, payment options and cancellation policy",
        "Bilingual content, Greek and English",
      ],
    },
    serviceKeys: ["websites", "seoAeo"],
    desktopImage: "/projects/konstantinopoulou-kyparissia-desktop.png",
    mobileImage: "/projects/konstantinopoulou-kyparissia-mobile.png",
    mockupImage: "/projects/konstantinopoulou-kyparissia-mockup.png",
    url: "https://konstantinopoulou-kyparissia.vercel.app/en",
  },
  {
    slug: "antoniadis-autoservice",
    title: "Antoniadis Auto Service",
    description: {
      el: "Ιστοσελίδα για συνεργείο αυτοκινήτων",
      en: "Website for a car service and repair garage",
    },
    category: { el: "Συνεργείο αυτοκινήτων (εξειδίκευση NISSAN)", en: "Car service garage (NISSAN specialist)" },
    location: { el: "Ηλιούπολη, Αθήνα", en: "Ilioupoli, Athens" },
    summary: {
      el: "Συνεργείο με εξειδίκευση στη NISSAN, που λειτουργεί στην Ηλιούπολη από το 1970. Το site μετατρέπει πενήντα χρόνια φήμης σε κάτι που βρίσκει η Google, με το τηλέφωνο ένα πάτημα μακριά σε κάθε σελίδα.",
      en: "A NISSAN specialist garage that has run in Ilioupoli since 1970. The site turns fifty years of word of mouth into something Google can find, with the phone number one tap away on every page.",
    },
    highlights: {
      el: [
        "Υπηρεσίες: service, διαγνωστικός έλεγχος, φρένα, κλιματισμός, αναρτήσεις",
        "Πώληση ανταλλακτικών και μπαταριών",
        "Κουμπιά κλήσης σε κάθε ενότητα της σελίδας",
        "Ιστορικό της επιχείρησης από το 1970 ως στοιχείο εμπιστοσύνης",
        "Δίγλωσσο περιεχόμενο, ελληνικά και αγγλικά",
      ],
      en: [
        "Services: servicing, diagnostics, brakes, air-conditioning, suspension",
        "Parts and battery sales",
        "Call buttons in every section of the page",
        "The business's history since 1970 used as a trust signal",
        "Bilingual content, Greek and English",
      ],
    },
    serviceKeys: ["websites", "seoAeo"],
    desktopImage: "/projects/antoniadis-autoservice-desktop.png",
    mobileImage: "/projects/antoniadis-autoservice-mobile.png",
    mockupImage: "/projects/antoniadis-autoservice-mockup.png",
    url: "https://www.antoniadis-autoservice.gr",
  },
  {
    slug: "vous-kreopoleio",
    title: "Vous",
    description: {
      el: "Ιστοσελίδα με online παραγγελίες για κρεοπωλείο",
      en: "Website for a butcher shop in Ilioupoli",
    },
    category: { el: "Κρεοπωλείο", en: "Butcher shop" },
    location: { el: "Ηλιούπολη, Αθήνα", en: "Ilioupoli, Athens" },
    summary: {
      el: "Κρεοπωλείο στην Κάτωνος, με κρέατα που κόβονται στο χέρι καθημερινά. Το site δίνει στο μαγαζί δικό του κανάλι παραγγελιών με διανομή στη γειτονιά, χωρίς ποσοστό σε πλατφόρμα delivery.",
      en: "A butcher on Katonos street, with meat hand-cut daily. The site gives the shop its own ordering channel and neighbourhood delivery, without paying a delivery platform a cut.",
    },
    highlights: {
      el: [
        "Online παραγγελίες απευθείας από το κατάστημα",
        "Διανομή στη γειτονιά σε καθορισμένο ωράριο (12:00–16:00)",
        "Αναλυτικός κατάλογος κρεάτων, ελληνικών και εισαγωγής",
        "Αξιολογήσεις πελατών και χάρτης Google",
        "Δίγλωσσο περιεχόμενο, ελληνικά και αγγλικά",
      ],
      en: [
        "Online ordering straight from the shop",
        "Neighbourhood delivery in a set window (12:00–16:00)",
        "Detailed catalogue of Greek and imported cuts",
        "Customer reviews and Google Maps",
        "Bilingual content, Greek and English",
      ],
    },
    serviceKeys: ["eshop", "websites"],
    desktopImage: "/projects/vous-kreopoleio-desktop.png",
    mobileImage: "/projects/vous-kreopoleio-mobile.png",
    mockupImage: "/projects/vous-kreopoleio-mockup.png",
    url: "https://www.vous-kreopoleio.gr/el",
  },
  {
    slug: "sifnios-ixthiopolio",
    title: "O Sifnios",
    description: {
      el: "Ιστοσελίδα με παραγγελίες για ιχθυοπωλείο & ψητοπωλείο",
      en: "Website for a fish market and grill",
    },
    category: { el: "Ιχθυοπωλείο & ψάρια ψητά", en: "Fish market & grill" },
    location: { el: "Αργυρούπολη & Άγιος Δημήτριος, Αθήνα", en: "Argyroupoli & Agios Dimitrios, Athens" },
    summary: {
      el: "Ιχθυοπωλείο με δύο καταστήματα στα νότια προάστια, που ψήνει κατά παραγγελία. Επειδή το εμπόρευμα αλλάζει κάθε μέρα, ο κατάλογος ενημερώνεται ζωντανά — ο πελάτης βλέπει τι υπάρχει σήμερα, όχι τι υπήρχε τον περασμένο μήνα.",
      en: "A fishmonger with two shops in the southern suburbs that grills to order. Because the catch changes daily, the menu updates live — customers see what is in today, not what was in last month.",
    },
    highlights: {
      el: [
        "Δύο καταστήματα, σε Αργυρούπολη και Άγιο Δημήτριο",
        "Ημερήσιος κατάλογος που ενημερώνεται με τη φρέσκια ψαριά",
        "Δική του εφαρμογή παραγγελιών, χωρίς προμήθειες τρίτων",
        "Ψήσιμο κατά παραγγελία και δωρεάν καθάρισμα",
        "Delivery ή παραλαβή, με δίγλωσσο περιβάλλον",
      ],
      en: [
        "Two shops, in Argyroupoli and Agios Dimitrios",
        "A daily menu that updates with the fresh catch",
        "Its own ordering app, with no third-party commission",
        "Grilling on demand and free fish cleaning",
        "Delivery or pickup, in a bilingual interface",
      ],
    },
    serviceKeys: ["eshop", "websites"],
    desktopImage: "/projects/sifnios-ixthiopolio-desktop.png",
    mobileImage: "/projects/sifnios-ixthiopolio-mobile.png",
    mockupImage: "/projects/sifnios-ixthiopolio-mockup.png",
    url: "https://www.sifnios.gr",
  },
  {
    slug: "moiss-defense-systems",
    title: "MOISS Defense Systems",
    description: {
      el: "Ιστοσελίδα για εταιρεία αμυντικών συστημάτων & προμηθειών",
      en: "Website for a defense procurement and consulting firm",
    },
    category: { el: "Αμυντικά συστήματα & προμήθειες", en: "Defence systems & procurement" },
    summary: {
      el: "Εταιρική παρουσίαση για εταιρεία αμυντικών συστημάτων και προμηθειών, με λιτό, θεσμικό ύφος και αγγλόφωνο περιεχόμενο για διεθνείς συνεργάτες.",
      en: "A corporate site for a defence systems and procurement firm, in a restrained institutional tone with English content for international partners.",
    },
    highlights: {
      el: [
        "Εταιρική παρουσίαση με θεσμικό ύφος",
        "Ενότητες υπηρεσιών και τομέων δραστηριότητας",
        "Αγγλόφωνο περιεχόμενο για διεθνείς συνεργάτες",
        "Φόρμα επικοινωνίας για επαγγελματικά αιτήματα",
      ],
      en: [
        "Corporate presentation with an institutional tone",
        "Service and capability sections",
        "English content for international partners",
        "Contact form for business enquiries",
      ],
    },
    serviceKeys: ["websites", "customSoftware"],
    desktopImage: "/projects/moiss-defense-systems-desktop.png",
    mobileImage: "/projects/moiss-defense-systems-mobile.png",
    mockupImage: "/projects/moiss-defense-systems-mockup.png",
    url: "https://moiss-defense-systems.vercel.app",
    // The Vercel deployment currently returns 404, so the portfolio stops
    // linking out to it. Redeploy, then delete this line.
    live: false,
  },
];

/** Projects whose screenshots have been captured — the ones we can actually show. */
export const SHOWCASE_PROJECTS = PROJECTS.filter((project) => project.mockupImage);

export const getProjectBySlug = (slug: string): Project | undefined =>
  PROJECTS.find((project) => project.slug === slug);

export const getProjectsByService = (serviceKey: string, limit = 3): Project[] =>
  SHOWCASE_PROJECTS.filter((project) => project.serviceKeys.includes(serviceKey)).slice(
    0,
    limit
  );
