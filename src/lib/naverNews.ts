export type NewsCategory = '경제' | '사회'

export interface NewsItem {
  title: string
  link: string
  originallink: string
  description: string
  pubDate: string
}

interface NaverNewsResponse {
  lastBuildDate: string
  total: number
  start: number
  display: number
  items: NewsItem[]
}

function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#039;/g, "'")
}

function isToday(pubDateStr: string): boolean {
  const pub = new Date(pubDateStr)
  const now = new Date()
  return (
    pub.getFullYear() === now.getFullYear() &&
    pub.getMonth() === now.getMonth() &&
    pub.getDate() === now.getDate()
  )
}

export async function fetchTodayNews(category: NewsCategory, count = 40): Promise<NewsItem[]> {
  const params = new URLSearchParams({
    query: category,
    display: String(count),
    start: '1',
    sort: 'date',
  })

  const res = await fetch(`/naver-api/v1/search/news.json?${params}`)

  if (!res.ok) {
    throw new Error(`네이버 API 오류: ${res.status}`)
  }

  const data: NaverNewsResponse = await res.json()

  return data.items
    .filter((item) => isToday(item.pubDate))
    .map((item) => ({
      ...item,
      title: stripHtmlTags(item.title),
      description: stripHtmlTags(item.description),
    }))
}
