import { test, expect } from '@playwright/test'
import { skipAcceptCertsRedirect } from '../../helpers'

test.describe('Tranfer funds and make payments flow', () => {
    test.beforeEach(async ({ page }) => {
        await skipAcceptCertsRedirect(page)

        await page.goto('http://zero.webappsecurity.com/index.html')
        await page.click('#signin_button')
        await page.fill('#user_login', 'username')
        await page.fill('#user_password', 'password')
        await page.click('input[type="submit"]')
    })

    test('Transfer funds', async ({ page }) => {
        // Given
        await page.click('#transfer_funds_tab')
        await page.selectOption('#tf_fromAccountId', '2')
        await page.selectOption('#tf_toAccountId', '1')
        await page.fill('#tf_amount', '500')
        await page.fill('#tf_description', 'Test transfer from Saving to Checking accounts')

        // When
        await page.click('button[type="submit"]')

        // Then
        const boardHeader = await page.locator('h2.board-header')
        await expect(boardHeader).toContainText('Verify')
        const description = await page.locator('#tf_description')
        await expect(description).toHaveValue('Test transfer from Saving to Checking accounts')
        const amount = await page.locator('#tf_amount')
        await expect(amount).toHaveValue('500')
        const fromAccount = await page.locator('[name="fromAccountId"]')
        await expect(fromAccount).toHaveValue('2')
        const toAccount = await page.locator('[name="toAccountId"]')
        await expect(toAccount).toHaveValue('1')

        // When
        await page.click('button[type="submit"]')

        // Then
        const confirmationMessage = page.locator('.alert-success')
        await expect(confirmationMessage).toContainText('You successfully submitted your transaction.')
    })
})