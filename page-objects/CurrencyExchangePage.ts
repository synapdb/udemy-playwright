import { expect, Locator, Page } from "@playwright/test";

export class CurrencyExchangePage {
    readonly page: Page
    readonly purchaseForeignCurrencyTab: Locator
    readonly currencySelectBox: Locator
    readonly sellRate: Locator
    readonly amountInput: Locator
    readonly inDollarsCheckbox: Locator
    readonly convertButton: Locator
    readonly conversionAmount: Locator
    readonly purchaseButton: Locator
    readonly message: Locator

    constructor(page: Page) {
        this.page = page

        this.purchaseForeignCurrencyTab = page.getByRole('link', { name: 'Purchase Foreign Currency' })
        this.currencySelectBox = page.locator('#pc_currency')
        this.sellRate = page.locator('#sp_sell_rate')
        this.amountInput = page.locator('#pc_amount')
        this.inDollarsCheckbox = page.locator('#pc_inDollars_true')
        this.convertButton = page.locator('#pc_calculate_costs')
        this.conversionAmount = page.locator('#pc_conversion_amount')
        this.purchaseButton = page.locator('#purchase_cash')
        this.message = page.locator('#alert_content')
    }

    async convertCurrency(currency: string, amount: number) {
        await this.purchaseForeignCurrencyTab.click()

        await this.currencySelectBox.selectOption(currency)
        await expect(this.sellRate).toContainText(`1 dollar (${currency})`)

        await this.amountInput.fill(amount.toString())
        await this.inDollarsCheckbox.click()

        await this.convertButton.click()
        await expect(this.conversionAmount).toContainText(`${amount.toFixed(2)} U.S. dollar (USD)`)

        await this.purchaseButton.click()
    }

    async assertSuccessMessage() {
        await expect(this.message).toBeVisible()
        await expect(this.message).toContainText('Foreign currency cash was successfully purchased')
    }
}