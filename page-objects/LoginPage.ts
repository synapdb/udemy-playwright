import { expect, Locator, Page } from '@playwright/test'
import { baseUrl } from '../fixtures/urls'
import { User } from '../fixtures/users'

export class LoginPage {
    readonly page: Page

    // Locators are defined once here, so a selector change is a one-line fix.
    readonly usernameInput: Locator
    readonly passwordInput: Locator
    readonly submitButton: Locator
    readonly errorMessage: Locator

    // Constructor: Inbit selectors from the page
    constructor(page: Page) {
        this.page = page
        this.usernameInput = page.locator('#user_login')
        this.passwordInput = page.locator('#user_password')
        this.submitButton = page.locator('input[type="submit"]')
        this.errorMessage = page.locator('.alert-error')
    }

    // Define the login page methods
    /** Opens the home page, where the "Sign in" button lives. */
    async visit() {
        await this.page.goto(`${baseUrl}/`)
    }

    /** Fills in and submits the login form (which must already be open). */
    async login({ username, password }: User) {
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
        await this.submitButton.click()
    }

    async logout() {
        await this.page.goto(`${baseUrl}/logout.html`)
    }

    // Assertion methods
    /** Asserts the login form shows the "wrong credentials" error. */
    async assertLoginFailed() {
        await expect(this.errorMessage).toHaveText('Login and/or password are wrong.')
    }
}
