import { test } from '@playwright/test'
import { HomePage } from '../../page-objects/HomePage'
import { SearchResultsPage } from '../../page-objects/SearchResultsPage'

test.describe('Search Results', () => {
    let homePage: HomePage
    let searchResultsPage: SearchResultsPage

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page)
        searchResultsPage = new SearchResultsPage(page)
    })

    test('Should find search results', async () => {
        // Given
        await homePage.visit()

        // When
        await homePage.searchFor('bank')

        // Then
        // Wait for the results page to load before looking at the links
        await searchResultsPage.assertLoaded()
        await searchResultsPage.assertResults([/Credit Card/, /Banking/])
    })

})
