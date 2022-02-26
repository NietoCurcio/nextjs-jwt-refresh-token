import { setupAPIClient } from '../services/api'
import { withSSRAuth } from '../utils/withSSRAuth'

export default function Dashboard() {
  return (
    <>
      <h1>Metrics</h1>
    </>
  )
}

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    // in server-side parseCookies only works passing the ctx
    const apiClient = setupAPIClient(ctx)
    const response = await apiClient.get('/me')

    return {
      props: {},
    }
  },
  {
    permissions: ['metrics.list'],
    roles: ['metrics.list'],
  }
)
