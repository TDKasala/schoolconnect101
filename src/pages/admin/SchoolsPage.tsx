import React, { useState } from 'react'
import { SchoolList } from '../../components/admin/SchoolList'
import { Helmet } from 'react-helmet-async'

export const SchoolsPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Function to trigger a refresh
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <>
      <Helmet>
        <title>Écoles | SchoolConnect</title>
      </Helmet>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <SchoolList refreshTrigger={refreshTrigger} />
      </div>
    </>
  )
}
