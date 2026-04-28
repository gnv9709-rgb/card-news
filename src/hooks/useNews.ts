import { useState, useEffect, useCallback } from 'react'
import { fetchTodayNews, type NewsCategory, type NewsItem } from '../lib/naverNews'

interface UseNewsResult {
  items: NewsItem[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useNews(category: NewsCategory): UseNewsResult {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTodayNews(category)
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '뉴스를 불러오지 못했습니다')
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    load()
  }, [load])

  return { items, loading, error, refetch: load }
}
