import { useEffect, useState } from 'react'

export default function useCategory() {
  const [category, setCategory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/category')
      .then((res) => res.json())
      .then((data) => {
        setCategory(data.data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [])

  return {
    category,
    loading,
    error,
  }
}
