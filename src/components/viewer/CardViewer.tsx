import { useState, useCallback } from 'react'
import type { CardNews } from '../../data/cards'
import { CardSlide } from '../card/CardSlide'
import { useKeyboardNav } from '../../hooks/useKeyboardNav'
import styles from './CardViewer.module.css'

interface CardViewerProps {
  cardNews: CardNews
}

export function CardViewer({ cardNews }: CardViewerProps) {
  const [current, setCurrent] = useState(0)
  const total = cardNews.slides.length

  const goToPrev = useCallback(() => {
    setCurrent((c) => (c > 0 ? c - 1 : c))
  }, [])

  const goToNext = useCallback(() => {
    setCurrent((c) => (c < total - 1 ? c + 1 : c))
  }, [total])

  useKeyboardNav({ onPrev: goToPrev, onNext: goToNext })

  return (
    <section className={styles.viewer} aria-label={cardNews.title}>
      <header className={styles.header}>
        <span className={styles.category}>{cardNews.category}</span>
        <h1 className={styles.title}>{cardNews.title}</h1>
        <time className={styles.date} dateTime={cardNews.publishedAt}>
          {cardNews.publishedAt}
        </time>
      </header>

      <div className={styles.stage} role="region" aria-live="polite">
        {cardNews.slides.map((slide, i) => (
          <CardSlide
            key={slide.id}
            slide={slide}
            total={total}
            isActive={i === current}
          />
        ))}
      </div>

      <nav className={styles.controls} aria-label="슬라이드 탐색">
        <button
          className={styles.navBtn}
          onClick={goToPrev}
          disabled={current === 0}
          aria-label="이전 슬라이드"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.dots} role="tablist" aria-label="슬라이드 목록">
          {cardNews.slides.map((slide, i) => (
            <button
              key={slide.id}
              role="tab"
              aria-selected={i === current}
              aria-label={`슬라이드 ${i + 1}`}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>

        <button
          className={styles.navBtn}
          onClick={goToNext}
          disabled={current === total - 1}
          aria-label="다음 슬라이드"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </nav>
    </section>
  )
}
