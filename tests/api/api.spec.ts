import { test, expect } from '@playwright/test'

test.describe.parallel('API Testing', () => {
    const baseUrl = "https://reqres.in/api"
    test('Simple API test - assert response status', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/2`)
        expect(response.status()).toBe(200)
    })

    test('Simple API test - assert invaliid endpoint', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/2sss`)
        expect(response.status()).toBe(404)
    })

    test("Get Request - Get User Detail", async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/1`)
        expect(response.status()).toBe(200)

        const responseBody = await response.json()

        //console.log(responseBody)
        expect(responseBody.data.id).toBe(1)
        expect(responseBody.data.first_name).toBe("George")
        expect(responseBody.data.last_name).toBe("Bluth")
        expect(responseBody.data.email).toBe('george.bluth@reqres.in')
        expect(responseBody.support.url).toBeTruthy()
    })

    test('POST Request - Create New User', async ({ request }) => {
        const response = await request.post(`${baseUrl}/users`, {
            data: {
                id: 1000,
            }
        })
        expect(response.status()).toBe(201)
        const responseBody = await response.json()
        expect(responseBody.id).toBe(1000)
        expect(responseBody.createdAt).toBeTruthy()
    })

    test('POST Request - Login Successfull', async ({ request }) => {
        const response = await request.post(`${baseUrl}/login`, {
            data: {
                email: "eve.holt@reqres.in",
                password: "cityslicka"
            }
        })
        expect(response.status()).toBe(200)
        const responseBody = await response.json()
        expect(responseBody.token).toBeTruthy()
    })

    test('POST Request - Login Unsuccessfull', async ({ request }) => {
        const response = await request.post(`${baseUrl}/login`, {
            data: {
                email: "eve.holt@reqres.in"
            }
        })
        expect(response.status()).toBe(400)
        const responseBody = await response.json()
        expect(responseBody.error).toBe("Missing password")
    })

    test('PUT Request - Update User', async ({ request }) => {
        const response = await request.put(`${baseUrl}/users/2`, {
            data: {
                name: "Yzabel Thomas",
                job: "Chief Engineer"
            }
        })
        expect(response.status()).toBe(200)
        const responseBody = await response.json()
        expect(responseBody.name).toBe("Yzabel Thomas")
        expect(responseBody.job).toBe("Chief Engineer")
        expect(responseBody.updatedAt).toBeTruthy()
    })

    test('DELETE Request - Delete User', async ({ request }) => {
        const response = await request.delete(`${baseUrl}/users/2`)
        expect(response.status()).toBe(204)
    })
})