import { expect, Locator, Page } from '@playwright/test'
import { baseUrl } from '../fixtures/urls'

export class HomePage {
    readonly page: Page
    readonly signInButton: Locator
    readonly searchBox: Locator
    readonly feedbackLink: Locator

    constructor(page: Page) {
        this.page = page
        this.signInButton = page.locator('#signin_button')
        this.searchBox = page.locator('#searchTerm')
        this.feedbackLink = page.locator('#feedback')
    }

    /** Opens the home page, where the "Sign in" button lives. */
    async visit() {
        await this.page.goto(`${baseUrl}/`)
    }

    /** Clicks "Sign in" on the home page to reveal the login form. */
    async clickOnSignIn() {
        await this.signInButton.click()
    }

    async clickOnFeedbackLink() {
        await this.feedbackLink.click()
    }

    /** Fills the search box with the given text and presses Enter. */
    async searchFor(phrase: string) {
        await this.searchBox.fill(phrase)
        await this.searchBox.press('Enter')
    }

    /** Asserts the user is back on the public home page, with the "Sign in" button shown. */
    async assertLoggedOut() {
        await expect(this.page).toHaveURL(`${baseUrl}/index.html`)
        await expect(this.signInButton).toBeVisible()
    }
}
