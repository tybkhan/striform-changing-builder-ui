import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'

const SubmissionsPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>()
  const [submissions, setSubmissions] = useState([])

  const fetchSubmissions = useCallback(() => {
    // Fetch submissions logic here
    // This is just a placeholder, replace with your actual logic
    const storedSubmissions = JSON.parse(localStorage.getItem(`responses_${formId}`) || '[]')
    setSubmissions(storedSubmissions)
  }, [formId])

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  return (
    <div>
      <h1>Submissions for Form {formId}</h1>
      {/* Render submissions here */}
    </div>
  )
}

export default SubmissionsPage