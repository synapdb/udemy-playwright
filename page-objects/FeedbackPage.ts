import { expect, Locator, Page } from '@playwright/test'
import { baseUrl } from '../fixtures/urls'

export class FeedbackPage {
    readonly page: Page
    readonly nameInput: Locator
    readonly emailInput: Locator
    readonly subjectInput: Locator
    readonly commentInput: Locator
    readonly clearButton: Locator
    readonly submitButton: Locator
    readonly confirmationMessage: Locator

    constructor(page: Page) {
        this.page = page
        this.nameInput = page.locator('#name')
        this.emailInput = page.locator('#email')
        this.subjectInput = page.locator('#subject')
        this.commentInput = page.locator('#comment')
        this.clearButton = page.locator('input[value="Clear"]')
        this.submitButton = page.getByRole('button', { name: 'Send Message' })
        this.confirmationMessage = page.getByText('Thank you for your comments')
    }

    async fillForm(name: string, email: string, subject: string, comment: string) {
        await this.nameInput.fill(name)
        await this.emailInput.fill(email)
        await this.subjectInput.fill(subject)
        await this.commentInput.fill(comment)
    }

    async resetForm() {
        await this.clearButton.click()
    }

    async submitForm() {
        await this.submitButton.click()
    }

    async feedBackForSent() {
        await expect(this.confirmationMessage).toBeVisible()
    }

    async assertFormReset() {
        await expect(this.nameInput).toBeEmpty()
        await expect(this.emailInput).toBeEmpty()
        await expect(this.subjectInput).toBeEmpty()
        await expect(this.commentInput).toBeEmpty()
    }
}