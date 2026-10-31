import { expect, Locator, Page } from '@playwright/test'

export class SearchResultsPage {
    readonly page: Page
    readonly heading: Locator
    // Scoped to the results list only (not nav/footer links)
    readonly resultLinks: Locator

    constructor(page: Page) {
        this.page = page
        this.heading = page.getByRole('heading', { name: 'Search Results' })
        this.resultLinks = page.locator('h2:has-text("Search Results") ~ ul > li > a')
    }

    /** Asserts the results page has loaded (heading visible). */
    async assertLoaded() {
        await expect(this.heading).toBeVisible()
    }

    /** Asserts the result list has exactly these entries, in order. */
    async assertResults(expected: RegExp[]) {
        // Count, order and text in one auto-retrying pair of assertions
        await expect(this.resultLinks).toHaveCount(expected.length)
        await expect(this.resultLinks).toHaveText(expected)
    }
}
