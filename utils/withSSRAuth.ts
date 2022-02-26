import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next'
import { destroyCookie, parseCookies } from 'nookies'
import { AuthTokenError } from '../services/errors/AuthTokenError'
import decode from 'jwt-decode'
import { validateUserPermissions } from './validateUserPermissions'

interface WithSSRAuthOptions {
  permissions?: string[]
  roles?: string[]
}

// high order function receives a function or return a function,
// callback is the function passed as argument
export function withSSRAuth<P>(
  callback: GetServerSideProps<P>,
  options?: WithSSRAuthOptions
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)
    const token = cookies['nextauth.token']
    //   decode is a synonum of decrypt, it's just a way of represent data
    //   represent data in alphanumerics characters for example
    //   thus, it's different from decryptograph and cryptograph, this is secret data

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    if (options) {
      const user = decode<{ permissions: string[]; roles: string[] }>(token)
      const { permissions, roles } = options

      const userHasValidPermissions = validateUserPermissions({
        user,
        permissions,
        roles,
      })

      if (!userHasValidPermissions) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          },
        }
      }
    }

    try {
      return await callback(ctx)
    } catch (error) {
      if (error instanceof AuthTokenError) {
        destroyCookie(ctx, 'nextauth.token')
        destroyCookie(ctx, 'nextauth.refreshToken')

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
    }
  }
}
