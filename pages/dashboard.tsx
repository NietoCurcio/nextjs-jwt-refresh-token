import { useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { api } from '../services/api'

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    api.get('/me').then((res) => {
      console.log('dashboard data:')
      console.log(res)
    })
  }, [])

  return <h1>dashboard {user?.email}</h1>
}
