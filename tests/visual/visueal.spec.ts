import { test, expect } from '@playwright/test'

test.describe.only('Visual regression', () => {

    test('Home page should look the same', async ({ page }) => {
        await page.goto('https://example-replica.netlify.app/')
        await expect(await page.screenshot()).toMatchSnapshot('homepage.png')
    })

    test('Single Element Snapshot', async ({ page }) => {
        await page.goto('https://example-replica.netlify.app/')

        const pageElement = page.locator('h1')
        await expect(await pageElement.screenshot()).toMatchSnapshot('page-title.png')
    })
})
