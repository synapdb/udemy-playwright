import { test } from '@playwright/test'
import { skipAcceptCertsRedirect } from '../../helpers'
import { validUser } from '../../fixtures/users'
import { HomePage } from '../../page-objects/HomePage'
import { LoginPage } from '../../page-objects/LoginPage'
import { AccountActivityPage } from '../../page-objects/AccountActivityPage'
import { Navbar } from '../../page-objects/components/Navbar'

test.describe('Filter transactions flow', () => {
    let homePage: HomePage
    let loginPage: LoginPage
    let accountActivityPage: AccountActivityPage
    let navbar: Navbar

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page)
        loginPage = new LoginPage(page)
        accountActivityPage = new AccountActivityPage(page)
        navbar = new Navbar(page)

        await skipAcceptCertsRedirect(page)

        await homePage.visit()
        await homePage.clickOnSignIn()
        await loginPage.login(validUser)
    })

    test('Verify the results for each account transaction', async () => {
        // Given
        await navbar.clickOnTab('Account Activity')

        // When
        await accountActivityPage.selectAccount('2')

        // Then
        await accountActivityPage.assertTransactionCount(3)

        await accountActivityPage.selectAccount('4')
        await accountActivityPage.assertTransactionCount(2)

        await accountActivityPage.selectAccount('6')
        await accountActivityPage.assertNoResults()
    })
})
