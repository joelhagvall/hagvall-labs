// Copy for the Maskera product page. Kept out of `../index.ts` on purpose:
// that module is in the root chunk every page loads, while this one is only
// imported by MaskeraPage.tsx and ships in its page chunk.
import sv from './sv.json'
import en from './en.json'

// Each language is checked against the other, so a key missing in either
// file fails `tsc`.
export const maskeraCopy = { sv: sv satisfies typeof en, en: en satisfies typeof sv }
