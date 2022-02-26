import { destroyCookie } from 'nookies'
import { useContext, useEffect } from 'react'
import { Can } from '../components/Can'
import { AuthContext } from '../contexts/AuthContext'
import { useCan } from '../hooks/useCan'
import { setupAPIClient } from '../services/api'
import { api } from '../services/apiClient'
import { withSSRAuth } from '../utils/withSSRAuth'

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext)

  // it does not ensures security. If it was a sensitive data
  // would be necessary to verify the permissions in the backend

  useEffect(() => {
    api
      .get('/me')
      .then((res) => {
        // console.log('dashboard data:')
        // console.log(res)
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <>
      <h1>dashboard {user?.email}</h1>

      <button onClick={signOut}>Sign out</button>

      <Can permissions={['metrics.list']}>
        <div>Metricas</div>
      </Can>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  // in server-side parseCookies only works passing the ctx
  const apiClient = setupAPIClient(ctx)

  const response = await apiClient.get('/me')

  return {
    props: {},
  }
})
