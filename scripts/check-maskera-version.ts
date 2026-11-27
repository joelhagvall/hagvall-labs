// Fails when npm has published a maskera version other than the one in the
// SoftwareApplication JSON-LD, so the product page never shows an old one.
import { maskeraVersion } from '../src/seo'

const response = await fetch('https://registry.npmjs.org/maskera/latest')
if (!response.ok) {
  console.error(`npm registry answered ${response.status} for maskera/latest`)
  process.exit(1)
}
const { version } = (await response.json()) as { version: string }
if (version !== maskeraVersion) {
  console.error(
    `maskeraVersion in src/seo.ts is ${maskeraVersion}, npm has ${version}: set maskeraVersion to '${version}'.`,
  )
  process.exit(1)
}
console.log(`maskeraVersion ${maskeraVersion} matches npm`)
