import { expect, Locator, Page } from '@playwright/test'

export class PaymentPage {
    readonly page: Page
    readonly payeeSelectBox: Locator
    readonly payeeDetailsButton: Locator
    readonly payeeDetail: Locator
    readonly accountSelectBox: Locator
    readonly amountInput: Locator
    readonly dateInput: Locator
    readonly descriptionInut: Locator
    readonly submitPaymentButton: Locator
    readonly message: Locator

    constructor(page: Page) {
        this.page = page
        this.payeeSelectBox = page.locator('#sp_payee')
        this.payeeDetailsButton = page.locator('#sp_get_payee_details')
        this.payeeDetail = page.locator('#sp_payee_details')
        this.accountSelectBox = page.locator('#sp_account')
        this.amountInput = page.locator('#sp_amount')
        this.dateInput = page.locator('#sp_date')
        this.descriptionInut = page.locator('#sp_description')
        this.submitPaymentButton = page.locator('#pay_saved_payees')
        this.message = page.locator('#alert_content > span')
    }

    async createPayment() {
        // Given
        await this.payeeSelectBox.selectOption('apple')
        await this.payeeDetailsButton.click()
        await expect(this.payeeDetail).toBeVisible()
        await this.accountSelectBox.selectOption('6')
        await this.amountInput.fill('5000')
        await this.dateInput.fill('2026-11-01')
        await this.descriptionInut.fill('Payment for apple')

        // When
        await this.submitPaymentButton.click()
    }

    async assertSuccessMessage() {
        // Then
        await expect(this.message).toBeVisible()
        await expect(this.message).toContainText('The payment was successfully submitted.')
    }
}