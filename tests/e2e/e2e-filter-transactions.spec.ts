import { test, expect } from '@playwright/test'
import { skipAcceptCertsRedirect } from '../../helpers'

test.describe('Filter transactions flow', () => {
    test.beforeEach(async ({ page }) => {
        await skipAcceptCertsRedirect(page)

        await page.goto('http://zero.webappsecurity.com/index.html')
        await page.click('#signin_button')
        await page.fill('#user_login', 'username')
        await page.fill('#user_password', 'password')
        await page.click('input[type="submit"]')
    })

    test('Verify the results for each account transaction', async ({ page }) => {
        // Given
        await page.click('#account_activity_tab')

        // When
        await page.selectOption('#aa_accountId', '2')

        // Then
        const checkingAccount = await page.locator('#all_transactions_for_account tbody tr')
        await expect(checkingAccount).toHaveCount(3)

        await page.selectOption('#aa_accountId', '4')
        const loanAccount = await page.locator('#all_transactions_for_account tbody tr')
        await expect(loanAccount).toHaveCount(2)

        await page.selectOption('#aa_accountId', '6')
        const noResult = await page.locator('.well')
        await expect(noResult).toBeVisible()
        await expect(noResult).toContainText('No results.')
    })
})