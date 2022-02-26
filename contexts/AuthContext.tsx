import Router from 'next/router'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { api } from '../services/apiClient'

interface SignInCredentials {
  email: string
  password: string
}

interface AuthProviderProps {
  children: ReactNode
}

interface User {
  email: string
  permissions: string[]
  roles: string[]
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>
  isAuthenticated: boolean
  user: User | null
}

export const AuthContext = createContext({} as AuthContextData)

export const signOut = () => {
  destroyCookie(undefined, 'nextauth.token')
  destroyCookie(undefined, 'nextauth.refreshToken')
  Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const isAuthenticated = !!user

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()
    if (token) {
      // trycatch only works with async await syntax
      api
        .get('/me')
        .then((response) => {
          const { email, permissions, roles } = response.data

          setUser({ email, permissions, roles })
        })
        .catch(() => {
          signOut()
        })
    }
  }, [])

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const response = await api.post('/sessions', {
        email,
        password,
      })
      const { token, refreshToken, permissions, roles } = response.data

      /*
      we must maintain the user data, as well as its token and refreshToken
      it can be done through:
      - sessionStorage: if the user closes the browser, the data it's gone
      - localStorage: the data persists even if the user closes the browser
      but as Nextjs created user interface with pre-rendering, we cannot access
      sessionStorage and localStorage in a Node.js environment
      - cookies: store data in browser, we can choose if that data will be send
      in a request or not. Cookies can be accessed server-side and client-side
    */

      // console.log(document.cookie)

      // ctx cookies in client-side is undefined
      // it's server-side responsability of renewing a expired token

      /*
      JWT is stateless, is not stored in a database, the backend only knows
      that a token was truly created by him because of the "secret", i.e.
      the backend uses the secret to sign the token 

      the backend also creates a "refresh token", once the token has been expired
      it will verify if the refresh token is valid to respond with a new token and
      a new refresh token. The refresh token is stored/maintened by the back-end
      with this approach since the refresh token is maintened by the database
      it's possible to revoke a refresh token and it will become invalid

      JWT, unlike the refresh token, is stateless and cannot be revoked
      */
      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      })

      setUser({ email, permissions, roles })

      // when the user logs in (first sign in), there's no token in cookies yet
      // thus will be retrieved a empty object in the services files from parseCoookies
      // but, once we have that data, we pass it into our services to do proper
      // requests with the token in the headers without the needing of reloading
      // the page (beucase with reloading, parseCookies will get the stored cookies)
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}
