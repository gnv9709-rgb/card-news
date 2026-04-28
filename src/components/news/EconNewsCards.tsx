import { useState } from 'react'

const TOTAL = 7

const COVER_PROMPT = `Dramatic editorial photo for a Korean economic news card cover.
Dark noir atmosphere. Close-up of a fractured glass globe splitting apart,
with stock market numbers and oil barrel silhouettes dissolving into dark shadows.
Cinematic, high contrast. Dark background with warm amber highlights and cool teal accents.
No text. Photorealistic. Magazine quality, editorial style.`

function PageDots({ active }: { active: number }) {
  return (
    <div className="pageno" style={{ color: 'var(--mint)' }}>
      {Array.from({ length: TOTAL }).map((_, i) => (
        <i key={i} className={i === active ? 'on' : ''} />
      ))}
    </div>
  )
}

type GenState = 'idle' | 'loading' | 'done' | 'error'

function useFalImage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [state, setState] = useState<GenState>('idle')

  async function generate(prompt: string) {
    const FAL_KEY = import.meta.env.VITE_FAL_KEY
    if (!FAL_KEY) {
      alert('.env.local 에 VITE_FAL_KEY=your_key 를 추가해주세요')
      return
    }

    setState('loading')
    try {
      // 제출
      const submitRes = await fetch('https://queue.fal.run/fal-ai/nano-banana-2', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${FAL_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, image_size: 'portrait_4_3', num_images: 1, seed: 42 }),
      })
      if (!submitRes.ok) throw new Error(`Submit 실패: ${submitRes.status}`)
      const { response_url, status_url } = await submitRes.json()

      // 폴링
      for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 2000))
        const s = await fetch(status_url, { headers: { 'Authorization': `Key ${FAL_KEY}` } })
        const { status } = await s.json()
        if (status === 'COMPLETED') {
          const r = await fetch(response_url, { headers: { 'Authorization': `Key ${FAL_KEY}` } })
          const data = await r.json()
          const url = data.images?.[0]?.url
          if (!url) throw new Error('이미지 URL 없음')
          setImageUrl(url)
          setState('done')
          return
        }
        if (status === 'FAILED') throw new Error('생성 실패')
      }
      throw new Error('타임아웃')
    } catch (e) {
      console.error(e)
      setState('error')
    }
  }

  return { imageUrl, state, generate }
}

export function EconNewsCards() {
  const { imageUrl, state, generate } = useFalImage()

  return (
    <div className="cards-row" id="econ-news-cards">

      {/* ── 01 COVER ──────────────────────────────────────── */}
      <div className="card bg-noir grain scratch" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* AI 생성 이미지 또는 checker 배경 */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="AI 생성 커버"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, opacity: 0.7 }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }} className="checker-noir" />
        )}
        <div
          className="pad"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 5, position: 'relative' }}
        >
          <div>
            <div
              className="halftone"
              style={{ width: 150, height: 190, transform: 'rotate(-5deg)', marginBottom: 20 }}
            >
              <span style={{ background: 'none', border: '1px dashed rgba(0,0,0,.4)', fontFamily: 'var(--f-mono)', fontSize: 10 }}>
                경제 속보
              </span>
            </div>
            <p className="mono" style={{ color: 'rgba(255,255,255,.5)', marginBottom: 8 }}>
              2026.04.28 / 경제 핫뉴스 5선
            </p>
          </div>
          <div>
            <h2 className="display-xl" style={{ color: 'var(--paper)', lineHeight: 1 }}>
              <span className="hl hl-shadow">세계 경제에</span>
              <br />균열이
              <br />생겼다
            </h2>
            <p className="body-m" style={{ color: 'rgba(255,255,255,.55)', marginTop: 20 }}>
              OPEC 탈퇴 · 에너지 급등 · 금리 동결
            </p>
            {/* AI 이미지 생성 버튼 */}
            <button
              onClick={() => generate(COVER_PROMPT)}
              disabled={state === 'loading'}
              style={{
                marginTop: 16,
                padding: '6px 14px',
                background: state === 'done' ? 'var(--mint)' : 'rgba(255,255,255,.12)',
                border: '1px solid rgba(255,255,255,.3)',
                borderRadius: 4,
                color: state === 'done' ? 'var(--ink)' : 'var(--paper)',
                fontFamily: 'var(--f-mono)',
                fontSize: 11,
                cursor: state === 'loading' ? 'wait' : 'pointer',
                letterSpacing: '.05em',
              }}
            >
              {state === 'idle' && '✦ AI 커버 생성'}
              {state === 'loading' && '⟳ 생성 중…'}
              {state === 'done' && '✓ 재생성'}
              {state === 'error' && '⚠ 다시 시도'}
            </button>
          </div>
        </div>
        <PageDots active={0} />
      </div>

      {/* ── 02 UAE OPEC 탈퇴 ──────────────────────────────── */}
      <div className="card bg-deep grain">
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stamp" style={{ transform: 'rotate(-4deg)' }}>BREAKING</span>
            <span className="mono" style={{ color: 'rgba(255,255,255,.4)' }}>01 / 05</span>
          </div>
          <div>
            <p className="mono" style={{ color: 'var(--mint)', marginBottom: 10 }}>OPEC 탈퇴</p>
            <h3 className="display-l" style={{ color: 'var(--paper)', fontSize: 44 }}>
              UAE, OPEC·OPEC+<br />전격 탈퇴 선언
            </h3>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p className="body-l" style={{ color: 'var(--paper)' }}>
                <span className="hl">석유 카르텔 60년 구조에<br />균열이 생겼다</span>
              </p>
              <p className="body-m" style={{ color: 'rgba(255,255,255,.8)' }}>
                5월 1일부터 공식 탈퇴. 사우디 주도 산유량 제한에서 벗어나 자국 에너지 생산을 독자적으로 확대.
              </p>
              <p className="mono" style={{ color: 'rgba(255,255,255,.45)' }}>
                UAE 석유수출 = GDP의 75% — 호르무즈 봉쇄로 타격 받은 상태
              </p>
            </div>
          </div>
        </div>
        <PageDots active={1} />
      </div>

      {/* ── 03 세계은행 에너지가격 ────────────────────────── */}
      <div className="card bg-noir grain scratch">
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'radial-gradient(ellipse at 50% 90%, #2a2520 0%, #0a0a0d 70%)',
          }}
        />
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 18, zIndex: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p className="mono" style={{ color: 'var(--acid)' }}>세계은행 경고</p>
            <span className="mono" style={{ color: 'rgba(255,255,255,.4)' }}>02 / 05</span>
          </div>
          <h3 className="display-l" style={{ color: 'var(--paper)', fontSize: 46 }}>
            에너지 가격<br />
            <span style={{ color: 'var(--acid)' }}>24%</span> 폭등 예고
          </h3>
          <p className="body-l" style={{ color: 'var(--paper)' }}>
            <span
              className="hl"
              style={{ '--mint': 'var(--acid)', '--mint-ink': '#1a1200' } as React.CSSProperties}
            >
              이란전쟁이 전 세계<br />물가 체계를 흔든다
            </span>
          </p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 6 }}>
              <div className="arrow-down acid" style={{ height: 44 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p className="body-m" style={{ color: 'rgba(255,255,255,.85)' }}>① 에너지 가격 폭등</p>
              <p className="body-m" style={{ color: 'rgba(255,255,255,.85)' }}>② 식량 가격 상승</p>
              <p className="body-m" style={{ color: 'rgba(255,255,255,.85)' }}>③ 고물가 장기화 → 금리 상승 압력</p>
            </div>
          </div>
          <p className="mono" style={{ color: 'rgba(255,255,255,.35)' }}>
            — WB 수석이코노미스트 인더밋 길
          </p>
        </div>
        <div className="pageno" style={{ color: 'var(--acid)' }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <i key={i} className={i === 2 ? 'on' : ''} />
          ))}
        </div>
      </div>

      {/* ── 04 한국은행 금리 동결 ─────────────────────────── */}
      <div className="card bg-bone grain">
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stamp">7연속 동결</span>
            <span className="mono" style={{ color: 'rgba(0,0,0,.45)' }}>03 / 05</span>
          </div>
          <div>
            <p className="mono" style={{ color: 'rgba(0,0,0,.5)', marginBottom: 12 }}>한국은행 금통위</p>
            <h3 className="display-xl" style={{ color: 'var(--ink)', fontSize: 60 }}>
              기준금리<br />
              <span style={{ background: 'var(--mint)', padding: '0 .12em', boxShadow: '4px 4px 0 var(--ink)' }}>
                동결
              </span>{' '}
              유지
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p className="body-l" style={{ color: 'var(--ink)' }}>
              <span style={{ background: 'var(--acid)', padding: '2px 8px', boxDecorationBreak: 'clone' }}>
                중동 전쟁 파급력<br />일단 지켜본다
              </span>
            </p>
            <p className="body-m" style={{ color: 'rgba(0,0,0,.7)' }}>
              전쟁 장기화 시 성장 하방 위험 확대. 경제 전망 경로 자체가 크게 바뀔 수 있다고 금통위원들이 경고했다.
            </p>
          </div>
        </div>
        <div className="pageno">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <i key={i} className={i === 3 ? 'on' : ''} />
          ))}
        </div>
      </div>

      {/* ── 05 비트코인 ───────────────────────────────────── */}
      <div className="card bg-deep grain">
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p className="mono" style={{ color: 'rgba(255,255,255,.45)', letterSpacing: '.06em' }}>
              CRYPTO · 04 / 05
            </p>
          </div>
          <h3 className="display-l" style={{ color: 'var(--paper)', fontSize: 44 }}>
            비트코인<br />
            8만달러 재돌파<br />
            <span style={{ color: 'var(--blood)' }}>'제동'</span>
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p className="body-l" style={{ color: 'var(--paper)' }}>
                <span className="hl">7만6,500달러로 후퇴<br />인플레이션 우려가 발목</span>
              </p>
              <p className="body-m" style={{ color: 'rgba(255,255,255,.75)' }}>
                3월 말 6만5,000달러에서 반등 이후 상승세를 이어왔지만 미국 경제지표 약세로 추가 강세 불투명.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="cutout" style={{ width: 80, height: 60, transform: 'rotate(-3deg)' }}>
                <span style={{ fontSize: 9 }}>CHART</span>
              </div>
              <p className="mono" style={{ color: 'rgba(255,255,255,.4)' }}>$76,500 USD</p>
            </div>
          </div>
        </div>
        <PageDots active={4} />
      </div>

      {/* ── 06 EU 구글 AI ─────────────────────────────────── */}
      <div className="card bg-noir grain scratch">
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p className="mono" style={{ color: 'rgba(255,255,255,.4)', letterSpacing: '.06em' }}>
              TECH · 05 / 05
            </p>
          </div>
          <div>
            <p className="mono" style={{ color: 'var(--mint)', marginBottom: 10 }}>플랫폼 경제 재편</p>
            <h3 className="display-l" style={{ color: 'var(--paper)', fontSize: 46 }}>
              EU, 구글에<br />'AI 개방'<br />압박 강화
            </h3>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p className="body-l" style={{ color: 'var(--paper)' }}>
              <span className="hl">안드로이드 생태계<br />구조 변화 예고</span>
            </p>
            <p className="body-m" style={{ color: 'rgba(255,255,255,.75)' }}>
              빅테크 폐쇄형 생태계를 얼마나 개방할 것인지 — 혁신과 규제 사이의 균형점을 찾는 싸움.
            </p>
            <p className="mono" style={{ color: 'rgba(255,255,255,.4)' }}>
              단순 기업 경쟁이 아닌 플랫폼 경제 전반의 규칙 재정립
            </p>
          </div>
        </div>
        <PageDots active={5} />
      </div>

      {/* ── 07 CTA ────────────────────────────────────────── */}
      <div className="card bg-royal grain">
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 className="display-l" style={{ color: 'var(--paper)', fontSize: 38 }}>
            오늘의 경제뉴스<br />어떠셨나요?
          </h3>
          <div style={{ position: 'relative', alignSelf: 'center', width: 360, height: 260 }}>
            <div
              className="halftone"
              style={{
                position: 'absolute', inset: 0,
                clipPath: 'polygon(0 30%, 60% 10%, 100% 0, 95% 100%, 55% 90%, 0 70%)',
                border: 0, boxShadow: 'none',
              }}
            />
            <svg style={{ position: 'absolute', right: -10, top: -10 }} width="120" height="120" viewBox="0 0 120 120">
              <path d="M30 60 Q 80 30 110 60" stroke="#FFE14A" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M30 60 Q 80 60 110 60" stroke="#FFE14A" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M30 60 Q 80 90 110 60" stroke="#FFE14A" strokeWidth="6" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="body-l" style={{ color: 'var(--paper)', textAlign: 'right', marginBottom: 12 }}>
              <span className="hl">매일 아침 경제 핫뉴스<br />팔로우하면 무료로 받아요</span>
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div
                className="sticker"
                style={{
                  background: 'var(--paper)', display: 'flex', gap: 10,
                  alignItems: 'center', transform: 'rotate(2deg)', padding: '10px 14px',
                }}
              >
                <div
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'repeating-linear-gradient(45deg, #15151a 0 4px, #2a2a30 4px 8px)',
                  }}
                />
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, lineHeight: 1.4, color: 'var(--ink)' }}>
                  <b style={{ fontSize: 12 }}>@econ_daily</b><br />
                  경제뉴스 큐레이터<br />
                  <span style={{ color: 'var(--blood)' }}>▶ 팔로우 &amp; 저장</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pageno">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <i key={i} className={i === 6 ? 'on' : ''} />
          ))}
        </div>
      </div>

    </div>
  )
}
