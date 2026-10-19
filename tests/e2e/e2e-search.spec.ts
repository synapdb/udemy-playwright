import { test, expect } from '@playwright/test'

test.describe('Serach Results', () => {

    test('Should find search results', async ({ page }) => {
        // Given
        await page.goto('http://zero.webappsecurity.com/index.html')
        await page.fill('#searchTerm', 'bank')

        // When
        await page.keyboard.press('Enter')

        // Then
        // Wait for the results page to load before looking at the links
        await expect(page.getByRole('heading', { name: 'Search Results' })).toBeVisible()

        // Scope to the results list only (not nav/footer links) and assert count,
        // order and text in one auto-retrying assertion
        const resultLinks = page.locator('h2:has-text("Search Results") ~ ul > li > a')
        await expect(resultLinks).toHaveCount(2)
        await expect(resultLinks).toHaveText([/Credit Card/, /Banking/])
    })

})