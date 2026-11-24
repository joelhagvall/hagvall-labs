// Exercise the prerendered demo with the same local Chrome used by the site audit.
import assert from 'node:assert/strict'
import { chromium } from 'playwright-core'
import { copy } from '../src/i18n'

const path = process.argv[2]
assert.ok(path === '/maskera' || path === '/en/maskera', 'Pass /maskera or /en/maskera')
const t = copy[path === '/maskera' ? 'sv' : 'en'].maskPreview
const url = new URL(path, process.env.BASE ?? 'http://localhost:4173').href
const browser = await chromium.launch({
  channel: 'chrome',
  executablePath: process.env.CHROME_PATH,
})

try {
  for (const javaScriptEnabled of [true, false]) {
    const page = await browser.newPage({
      javaScriptEnabled,
      viewport: { width: 320, height: 740 },
      reducedMotion: 'reduce',
    })
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(url, { waitUntil: 'networkidle' })

    const example = page.getByRole('radiogroup', { name: t.example })
    if (javaScriptEnabled) {
      const panel = page.getByRole('tabpanel')
      const masked = page.getByRole('tab', { name: t.masked, exact: true })
      assert.match(await panel.innerText(), /\[NAMN_1\]/)
      await masked.focus()
      await page.keyboard.press('ArrowLeft')
      assert.match(await panel.innerText(), /Anna Lindqvist/)
      const freeText = example.getByRole('radio', { name: t.freeText, exact: true })
      const structured = example.getByRole('radio', { name: t.structured, exact: true })
      assert.ok(await freeText.isChecked())
      assert.ok(await structured.isVisible())
      await freeText.focus()
      await page.keyboard.press('ArrowRight')
      assert.ok(await structured.isChecked())
      assert.match(await panel.innerText(), /anna@example\.com/)
      await masked.click()
      const result = await panel.innerText()
      assert.match(result, /\[EPOST_1\]/)
      assert.match(result, /\[IP_ADRESS_1\]/)
      assert.doesNotMatch(result, /anna@example\.com|192\.0\.2\.42/)
      await freeText.click()
      assert.ok(await freeText.isChecked())
      assert.match(await panel.innerText(), /\[ADRESS_1\]/)
    } else {
      assert.equal(await example.count(), 0)
      const panels = page.locator('[role="tabpanel"]')
      assert.ok(await panels.getByText('Anna Lindqvist', { exact: true }).isVisible())
      assert.ok(await panels.getByText('[NAMN_1]', { exact: true }).isVisible())
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    assert.deepEqual(errors, [])
    await page.close()
  }
  console.log('  Maskera preview passed with and without JavaScript')
} finally {
  await browser.close()
}
