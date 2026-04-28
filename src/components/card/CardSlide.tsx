import type { CardSlideData } from '../../data/cards'
import styles from './CardSlide.module.css'

interface CardSlideProps {
  slide: CardSlideData
  total: number
  isActive: boolean
}

export function CardSlide({ slide, total, isActive }: CardSlideProps) {
  return (
    <article
      className={`${styles.slide} ${isActive ? styles.active : ''}`}
      style={
        {
          '--slide-bg': slide.bgColor,
          '--slide-text': slide.textColor,
          '--slide-accent': slide.accentColor,
        } as React.CSSProperties
      }
      aria-hidden={!isActive}
    >
      <div className={styles.inner}>
        <span className={styles.counter}>
          {slide.slideNumber} / {total}
        </span>

        <div className={styles.content}>
          <h2 className={styles.title}>{slide.title}</h2>
          <p className={styles.body}>
            {slide.body.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i < slide.body.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        <div className={styles.accent} aria-hidden="true" />
      </div>
    </article>
  )
}
