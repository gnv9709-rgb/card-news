import { useState } from 'react'
import { useNews } from '../../hooks/useNews'
import type { NewsCategory, NewsItem } from '../../lib/naverNews'
import styles from './NewsPanel.module.css'

const CATEGORIES: NewsCategory[] = ['경제', '사회']

function formatPubTime(pubDateStr: string): string {
  const d = new Date(pubDateStr)
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function todayLabel(): string {
  return new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '-').replace('.', '')
}

function NewsRow({ item, index }: { item: NewsItem; index: number }) {
  return (
    <li className={styles.item}>
      <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
      <div className={styles.content}>
        <a
          href={item.originallink || item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.title}
          title={item.title}
        >
          {item.title}
        </a>
        <span className={styles.meta}>{formatPubTime(item.pubDate)}</span>
      </div>
    </li>
  )
}

export function NewsPanel() {
  const [category, setCategory] = useState<NewsCategory>('경제')
  const { items, loading, error, refetch } = useNews(category)

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.date}>{todayLabel()} 오늘의 뉴스</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className={styles.tabs}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`${styles.tab} ${category === c ? styles.tabActive : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
                {category === c && !loading && <span className={styles.count}>{items.length}</span>}
              </button>
            ))}
          </div>
          <button className={styles.refetch} onClick={refetch} title="새로고침">↺</button>
        </div>
      </div>

      {loading && <div className={styles.loading}>LOADING ···</div>}

      {error && <div className={styles.error}>{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className={styles.empty}>오늘 뉴스가 없거나 API 키를 확인해주세요</div>
      )}

      {!loading && items.length > 0 && (
        <ul className={styles.list}>
          {items.map((item, i) => (
            <NewsRow key={item.link} item={item} index={i} />
          ))}
        </ul>
      )}
    </div>
  )
}
