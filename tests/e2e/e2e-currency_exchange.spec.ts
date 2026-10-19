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

    test('Should convert currency', async ({ page }) => {
        // Given
        await page.click('#pay_bills_tab')
        await page.getByRole('link', { name: 'Purchase Foreign Currency' }).click()
        await page.selectOption('#pc_currency', 'CAD')
        const rate = await page.locator('#sp_sell_rate')
        await expect(rate).toContainText('1 dollar (CAD)')

        await page.locator("#pc_amount").fill('1000')
        await page.click('#pc_inDollars_true')
        //await page.getByLabel('U.S. dollar (USD)').click()

        // When
        await page.click('#pc_calculate_costs')

        // Then
        const convertionAmount = await page.locator("#pc_conversion_amount")
        await expect(convertionAmount).toContainText('1000.00 U.S. dollar (USD)')

        // When
        await page.click('#purchase_cash')

        const message = "Foreign currency cash was successfully purchased."
        const messageAlert = await page.locator('#alert_content')
        await expect(messageAlert).toBeVisible()
        await expect(messageAlert).toContainText(message)
    })
})