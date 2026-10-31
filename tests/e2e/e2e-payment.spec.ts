import { test } from '@playwright/test'
import { skipAcceptCertsRedirect } from '../../helpers'
import { validUser } from '../../fixtures/users'
import { HomePage } from '../../page-objects/HomePage'
import { LoginPage } from '../../page-objects/LoginPage'
import { PaymentPage } from '../../page-objects/PaymentPage'
import { Navbar } from '../../page-objects/components/Navbar'

test.describe.parallel('New Payment', () => {
    let homePage: HomePage
    let loginPage: LoginPage
    let paymentPage: PaymentPage
    let navbar: Navbar

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page)
        loginPage = new LoginPage(page)
        paymentPage = new PaymentPage(page)
        navbar = new Navbar(page)

        await skipAcceptCertsRedirect(page)

        await homePage.visit()
        await homePage.clickOnSignIn()
        await loginPage.login(validUser)
    })

    test('Should get payee details', async () => {
        // Given
        await navbar.clickOnTab('Pay Bills')

        // When
        await paymentPage.viewPayeeDetails('apple')

        // Then
        await paymentPage.assertPayeeDetailsVisible()
    })

    test('Should sent new payment', async ({ page }) => {
        // Given + When
        await navbar.clickOnTab('Pay Bills')
        await paymentPage.createPayment()

        // Then
        await paymentPage.assertSuccessMessage()
    })
})