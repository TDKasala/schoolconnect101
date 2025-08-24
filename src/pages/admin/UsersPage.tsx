import React, { useState } from 'react'
import { UserList } from '../../components/admin/UserList'

export const UsersPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Function to trigger a refresh
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <UserList refreshTrigger={refreshTrigger} />
    </div>
  )
}
