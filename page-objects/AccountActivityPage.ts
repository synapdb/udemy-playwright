import { expect, Locator, Page } from '@playwright/test'

export class AccountActivityPage {
    readonly page: Page
    readonly accountSelectBox: Locator
    readonly transactionRows: Locator
    readonly noResultsMessage: Locator

    constructor(page: Page) {
        this.page = page
        this.accountSelectBox = page.locator('#aa_accountId')
        this.transactionRows = page.locator('#all_transactions_for_account tbody tr')
        this.noResultsMessage = page.locator('.well')
    }

    /** Shows the transactions of the account with the given id (the dropdown option value). */
    async selectAccount(accountId: string) {
        await this.accountSelectBox.selectOption(accountId)
    }

    /** Asserts the transactions table lists exactly this many rows. */
    async assertTransactionCount(expected: number) {
        await expect(this.transactionRows).toHaveCount(expected)
    }

    /** Asserts the page shows the "No results." message for the selected account. */
    async assertNoResults() {
        await expect(this.noResultsMessage).toBeVisible()
        await expect(this.noResultsMessage).toContainText('No results.')
    }
}
