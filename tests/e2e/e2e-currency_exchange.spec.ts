import { test, expect } from '@playwright/test'
import { skipAcceptCertsRedirect } from '../../helpers'
import { LoginPage } from '../../page-objects/LoginPage'
import { HomePage } from '../../page-objects/HomePage'
import { Navbar } from '../../page-objects/components/Navbar'
import { CurrencyExchangePage } from '../../page-objects/CurrencyExchangePage'

test.describe('Tranfer funds and make payments flow', () => {
    let loginPage: LoginPage
    let homePage: HomePage
    let navbar: Navbar
    let currencyExchangePage: CurrencyExchangePage

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page)
        loginPage = new LoginPage(page)
        navbar = new Navbar(page)
        currencyExchangePage = new CurrencyExchangePage(page)

        await skipAcceptCertsRedirect(page)

        await homePage.visit()
        await homePage.clickOnSignIn()
        await loginPage.login({ username: 'username', password: 'password' })
    })

    test('Should convert currency', async ({ page }) => {
        // Given & When
        await navbar.clickOnTab('Pay Bills')
        // await page.getByRole('link', { name: 'Purchase Foreign Currency' }).click()
        // await page.selectOption('#pc_currency', 'CAD')
        // const rate = await page.locator('#sp_sell_rate')
        // await expect(rate).toContainText('1 dollar (CAD)')
        await currencyExchangePage.convertCurrency('CAD', 1000.00)

        // Then
        await currencyExchangePage.assertSuccessMessage()
    })
})