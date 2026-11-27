import sv from './sv.json'
import en from './en.json'

// Each language is checked against the other, so a key missing in either
// file fails `tsc`.
export const copy = { sv: sv satisfies typeof en, en: en satisfies typeof sv }
