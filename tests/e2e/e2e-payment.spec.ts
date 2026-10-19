import { test, expect } from '@playwright/test'
import { skipAcceptCertsRedirect } from '../../helpers'

test.describe.parallel('New Payment', () => {

    test.beforeEach(async ({ page }) => {
        await skipAcceptCertsRedirect(page)

        await page.goto('http://zero.webappsecurity.com/index.html')
        await page.click('#signin_button')
        await page.fill('#user_login', 'username')
        await page.fill('#user_password', 'password')
        await page.click('input[type="submit"]')
    })

    test('Should get payee details', async ({ page }) => {
        // Given
        await page.click('#pay_bills_tab')
        await page.selectOption('#sp_payee', 'apple')

        // When
        await page.click('#sp_get_payee_details')

        // Then
        await page.waitForSelector('#sp_payee_details')
    })

    test('Should sent new payment', async ({ page }) => {
        // Given
        await page.click('#pay_bills_tab')
        await page.selectOption('#sp_payee', 'apple')
        await page.selectOption('#sp_account', '6')
        await page.fill('#sp_amount', '5000')
        await page.fill('#sp_date', '2026-10-19')
        await page.fill('#sp_description', 'Payment for apple')

        // When
        await page.click('#pay_saved_payees')

        // Then
        const message = "The payment was successfully submitted."
        const messageAlert = await page.locator('#alert_content > span')
        await expect(messageAlert).toBeVisible()
        await expect(messageAlert).toHaveText(message)
    })
})