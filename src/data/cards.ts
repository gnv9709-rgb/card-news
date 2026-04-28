export interface CardSlideData {
  id: string
  slideNumber: number
  title: string
  body: string
  bgColor: string
  textColor: string
  accentColor: string
}

export interface CardNews {
  id: string
  title: string
  category: string
  publishedAt: string
  slides: CardSlideData[]
}

export const sampleCardNews: CardNews = {
  id: 'sample-001',
  title: '카드뉴스 제목을 입력하세요',
  category: '카테고리',
  publishedAt: '2026.04.28',
  slides: [
    {
      id: 'slide-1',
      slideNumber: 1,
      title: '카드뉴스 제목',
      body: '첫 번째 슬라이드입니다.\n내용을 입력해 주세요.',
      bgColor: '#1a1a2e',
      textColor: '#ffffff',
      accentColor: '#7c6fe0',
    },
    {
      id: 'slide-2',
      slideNumber: 2,
      title: '두 번째 슬라이드',
      body: '핵심 내용을 간결하게\n전달해 보세요.',
      bgColor: '#16213e',
      textColor: '#ffffff',
      accentColor: '#e94560',
    },
    {
      id: 'slide-3',
      slideNumber: 3,
      title: '세 번째 슬라이드',
      body: '카드뉴스는 짧고 명확한\n메시지가 효과적입니다.',
      bgColor: '#0f3460',
      textColor: '#ffffff',
      accentColor: '#f5a623',
    },
    {
      id: 'slide-4',
      slideNumber: 4,
      title: '마지막 슬라이드',
      body: '마무리 메시지를\n입력해 주세요.',
      bgColor: '#533483',
      textColor: '#ffffff',
      accentColor: '#e8d5b7',
    },
  ],
}
