import { expect, Locator, Page } from '@playwright/test'
import { baseUrl } from '../fixtures/urls'

export class HomePage {
    readonly page: Page
    readonly signInButton: Locator

    constructor(page: Page) {
        this.page = page
        this.signInButton = page.locator('#signin_button')
    }

    /** Opens the home page, where the "Sign in" button lives. */
    async visit() {
        await this.page.goto(`${baseUrl}/`)
    }

    /** Clicks "Sign in" on the home page to reveal the login form. */
    async clickOnSignIn() {
        await this.signInButton.click()
    }

    /** Asserts the user is back on the public home page, with the "Sign in" button shown. */
    async assertLoggedOut() {
        await expect(this.page).toHaveURL(`${baseUrl}/index.html`)
        await expect(this.signInButton).toBeVisible()
    }
}
