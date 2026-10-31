import { test, expect } from '@playwright/test'
import { skipAcceptCertsRedirect } from '../../helpers'
import { LoginPage } from '../../page-objects/LoginPage'
import { HomePage } from '../../page-objects/HomePage'

test.describe('Tranfer funds and make payments flow', () => {
    let loginPage: LoginPage
    let homePage: HomePage

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page)
        loginPage = new LoginPage(page)

        await skipAcceptCertsRedirect(page)

        await homePage.visit()
        await homePage.clickOnSignIn()
        await loginPage.login({ username: 'username', password: 'password' })
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