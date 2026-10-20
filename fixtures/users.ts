/**
 * Test data for the login flow.
 *
 * zero.webappsecurity.com is a public demo site and `username` / `password`
 * are its published demo credentials, so they are NOT secrets and are safe to
 * commit. They can still be overridden through environment variables
 * (TEST_USERNAME / TEST_PASSWORD), which is the upgrade path if this suite is
 * ever pointed at an environment with real credentials.
 */
export interface User {
    username: string
    password: string
}

export const validUser: User = {
    username: process.env.TEST_USERNAME ?? 'username',
    password: process.env.TEST_PASSWORD ?? 'password',
}

export const invalidUser: User = {
    username: 'invalid username',
    password: 'invalid password',
}
