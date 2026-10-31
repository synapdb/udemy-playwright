import { test, expect } from '@playwright/test'
import { HomePage } from '../../page-objects/HomePage'
import { FeedbackPage } from '../../page-objects/FeedbackPage'

test.describe.parallel('Feedback Form', () => {
    let homePage: HomePage
    let feedbackPage: FeedbackPage

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page)
        feedbackPage = new FeedbackPage(page)

        await homePage.visit()
        await homePage.clickOnFeedbackLink()
    })

    test('Reset feedback form', async ({ page }) => {
        // Given
        await feedbackPage.fillForm(
            'John Doe',
            'john.doe@example.com',
            'Test Subject',
            'This is a test comment')

        // When
        await feedbackPage.resetForm()

        // Then
        await feedbackPage.assertFormReset()
    })

    test('Submit feedback form', async ({ page }) => {
        // Given
        await feedbackPage.fillForm(
            'John Doe',
            'john.doe@example.com',
            'Test Subject',
            'This is a test comment')

        // When
        await feedbackPage.submitForm()

        // Then
        await feedbackPage.feedBackForSent()
    })
})