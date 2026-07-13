# 📸 Instagram — hexAIgon

Έτοιμα-για-ανέβασμα Instagram posts για κάθε έργο του portfolio.

## Στυλ post
Κάθε post δείχνει **την ίδια την ιστοσελίδα** (πραγματικό desktop screenshot μέσα σε browser frame)
και μόνο δύο πράγματα κειμένου: **τι είναι** (σύντομο, επαληθευμένο) + **το link**. Τίποτα άλλο.

## Περιεχόμενα
- **`posts/`** — 21 post images (1080×1350, 4:5) με browser frame — δείχνουν την ιστοσελίδα + τι είναι + link.
- **`posts-beach/`** — 21 post images (τετράγωνα 1:1) — τα έτοιμα «beach» mockups (laptop + θάλασσα),
  ήδη branded με `hexaigon.gr`. Έτοιμα για ανέβασμα as-is.
- **`captions.md`** — σύντομα captions (τι είναι + link) + hashtags για το καθένα (κοινά και για τα δύο sets).
- **`generator/`** — ο κώδικας που παράγει τα `posts/` (`projects.mjs` = δεδομένα, `generate.mjs` = template).
  Το `posts-beach/` είναι απλή αντιγραφή των `public/projects/*-mockup-beach.png`.

## Πώς ανεβάζω ένα post
1. Άνοιξε το `posts/<slug>.png` (π.χ. `posts/orderoo.png`).
2. Αντίγραψε το αντίστοιχο caption από το `captions.md`.
3. Ανέβασέ το στο Instagram, βάλε τα hashtags στο 1ο σχόλιο.

## Πώς ξαναφτιάχνω / προσθέτω posts
Τα κείμενα κάθε post ζουν στο `generator/projects.mjs`. Επεξεργάσου/πρόσθεσε εκεί και τρέξε:

```bash
node instagram/generator/generate.mjs
```

Χρησιμοποιεί τα mockup images από `public/projects/*-mockup.png` και το Playwright (ήδη εγκατεστημένο).

## Σημείωση
Παράγονται posts και για τα **21 έργα** του `lib/data/projects.ts`. Οι κατηγορίες («τι είναι»)
έχουν επαληθευτεί ένα-ένα από το live desktop screenshot κάθε site. Αν προστεθεί νέο έργο,
πρόσθεσέ το στο `projects.mjs` (με `label` + `domain`) και ξανατρέξε τον generator.
