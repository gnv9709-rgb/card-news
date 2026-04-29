import { useState } from 'react'

const TOTAL = 7

const COVER_IMAGE = '/generated/cover-korea-econ-transform.png'

const COVER_PROMPT = `Dramatic aerial view of South Korea's economic transformation.
Seoul skyline at golden hour with semiconductor chips, battery cells, and circuit board patterns
reflecting in the Han River. Corporate towers shifting and restructuring, symbolic of economic change.
Cinematic 4K, warm golden light mixed with cool blue technology glow. No text.
Ultra-realistic editorial photography, magazine cover quality.`

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

function useHiggsfieldImage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [state, setState] = useState<GenState>('idle')

  async function generate(prompt: string) {
    const API_KEY = import.meta.env.VITE_HIGGSFIELD_API_KEY
    if (!API_KEY) {
      alert('.env.local 에 VITE_HIGGSFIELD_API_KEY=your_key 를 추가해주세요')
      return
    }

    setState('loading')
    try {
      const submitRes = await fetch('https://mcp.higgsfield.ai/v1/generations/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: 'cinematic_studio_2_5', prompt, aspect_ratio: '3:4', resolution: '2k', count: 1 }),
      })
      if (!submitRes.ok) throw new Error(`Submit 실패: ${submitRes.status}`)
      const job = await submitRes.json()

      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 3000))
        const s = await fetch(`https://mcp.higgsfield.ai/v1/generations/${job.id}`, {
          headers: { 'Authorization': `Bearer ${API_KEY}` },
        })
        const data = await s.json()
        if (data.status === 'completed') {
          const url = data.results?.rawUrl
          if (!url) throw new Error('이미지 URL 없음')
          setImageUrl(url)
          setState('done')
          return
        }
        if (data.status === 'failed') throw new Error('생성 실패')
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
  const { imageUrl, state, generate } = useHiggsfieldImage()
  const coverSrc = imageUrl ?? COVER_IMAGE

  return (
    <div className="cards-row" id="econ-news-cards">

      {/* ── 01 COVER ──────────────────────────────────────── */}
      <div className="card bg-noir grain scratch" style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={coverSrc}
          alt="대한민국 경제 지형이 바뀐다"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, opacity: 0.65 }}
        />
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 2,
            background: 'linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,.6) 100%)',
          }}
        />
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
            <p className="mono" style={{ color: 'rgba(255,255,255,.55)', marginBottom: 8 }}>
              2026.04.29 / 경제 핫뉴스 5선
            </p>
          </div>
          <div>
            <h2 className="display-xl" style={{ color: 'var(--paper)', lineHeight: 1 }}>
              <span className="hl hl-shadow">대한민국</span>
              <br />경제 지형이
              <br />바뀐다
            </h2>
            <p className="body-m" style={{ color: 'rgba(255,255,255,.55)', marginTop: 20 }}>
              신용등급 AA · 반도체 파업 · 유가 급등
            </p>
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
              {state === 'idle' && '✦ AI 커버 재생성'}
              {state === 'loading' && '⟳ 생성 중…'}
              {state === 'done' && '✓ 재생성'}
              {state === 'error' && '⚠ 다시 시도'}
            </button>
          </div>
        </div>
        <PageDots active={0} />
      </div>

      {/* ── 02 S&P 한국 신용등급 AA ───────────────────────── */}
      <div className="card bg-bone grain">
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stamp">S&P 공식 발표</span>
            <span className="mono" style={{ color: 'rgba(0,0,0,.45)' }}>01 / 05</span>
          </div>
          <div>
            <p className="mono" style={{ color: 'rgba(0,0,0,.5)', marginBottom: 12 }}>국가신용등급</p>
            <h3 className="display-xl" style={{ color: 'var(--ink)', fontSize: 56, lineHeight: 1 }}>
              한국 신용등급<br />
              <span style={{ background: 'var(--mint)', padding: '0 .12em', boxShadow: '4px 4px 0 var(--ink)' }}>
                AA 유지
              </span>
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p className="body-l" style={{ color: 'var(--ink)' }}>
              <span style={{ background: 'var(--acid)', padding: '2px 8px', boxDecorationBreak: 'clone' }}>
                에너지 충격에도<br />반도체·재정 견고
              </span>
            </p>
            <p className="body-m" style={{ color: 'rgba(0,0,0,.7)' }}>
              S&P는 한국이 향후 3~4년 고소득 국가 평균 이상 성장률을 유지할 것으로 전망. 반도체 수출과 재정 건전성이 핵심 근거.
            </p>
          </div>
        </div>
        <div className="pageno">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <i key={i} className={i === 1 ? 'on' : ''} />
          ))}
        </div>
      </div>

      {/* ── 03 반도체 파업 리스크 ─────────────────────────── */}
      <div className="card bg-noir grain scratch">
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'radial-gradient(ellipse at 50% 90%, #2a1818 0%, #0a0a0d 70%)',
          }}
        />
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 18, zIndex: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p className="mono" style={{ color: 'var(--blood)' }}>산업 리스크</p>
            <span className="mono" style={{ color: 'rgba(255,255,255,.4)' }}>02 / 05</span>
          </div>
          <h3 className="display-l" style={{ color: 'var(--paper)', fontSize: 44, lineHeight: 1.1 }}>
            반도체 파업<br />
            <span style={{ color: 'var(--blood)' }}>"韓에만 있는</span><br />
            리스크"
          </h3>
          <p className="body-l" style={{ color: 'var(--paper)' }}>
            <span
              className="hl"
              style={{ '--mint': 'var(--blood)', '--mint-ink': '#fff' } as React.CSSProperties}
            >
              국민 70%도<br />"노조 요구 무리"
            </span>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p className="body-m" style={{ color: 'rgba(255,255,255,.85)' }}>
              정부·각계 우려 쏟아지는데도 파업 주도 노조 지도부 행태 무책임 비판.
            </p>
            <p className="mono" style={{ color: 'rgba(255,255,255,.4)' }}>
              반도체 = 수출 최대 효자 품목
            </p>
          </div>
        </div>
        <div className="pageno" style={{ color: 'var(--blood)' }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <i key={i} className={i === 2 ? 'on' : ''} />
          ))}
        </div>
      </div>

      {/* ── 04 고유가 대응 ────────────────────────────────── */}
      <div className="card bg-deep grain">
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stamp" style={{ transform: 'rotate(-4deg)' }}>정부 대응</span>
            <span className="mono" style={{ color: 'rgba(255,255,255,.4)' }}>03 / 05</span>
          </div>
          <div>
            <p className="mono" style={{ color: 'var(--acid)', marginBottom: 10 }}>에너지 긴급대책</p>
            <h3 className="display-l" style={{ color: 'var(--paper)', fontSize: 40, lineHeight: 1.1 }}>
              대통령<br />고유가 피해지원금<br />
              <span style={{ color: 'var(--acid)' }}>주유소 제한<br />해제 검토</span>
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p className="body-m" style={{ color: 'rgba(255,255,255,.8)' }}>
              중동 전쟁 장기화 우려 속 에너지 물가 직접 지원 확대. 청와대, 지원 대상 주유소 제한 규정 완화 방침.
            </p>
            <p className="mono" style={{ color: 'rgba(255,255,255,.4)' }}>
              BNP파리바 "유가 배럴당 200달러 시나리오" 경고
            </p>
          </div>
        </div>
        <PageDots active={3} />
      </div>

      {/* ── 05 UAE OPEC 탈퇴 ──────────────────────────────── */}
      <div className="card bg-deep grain">
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="stamp" style={{ transform: 'rotate(-2deg)' }}>BREAKING</span>
            <span className="mono" style={{ color: 'rgba(255,255,255,.4)' }}>04 / 05</span>
          </div>
          <div>
            <p className="mono" style={{ color: 'var(--mint)', marginBottom: 10 }}>에너지 패권 재편</p>
            <h3 className="display-l" style={{ color: 'var(--paper)', fontSize: 44, lineHeight: 1.1 }}>
              UAE, OPEC+<br />전격 탈퇴
            </h3>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p className="body-l" style={{ color: 'var(--paper)' }}>
              <span className="hl">석유 카르텔 60년<br />사우디 주도 구조 흔들</span>
            </p>
            <p className="body-m" style={{ color: 'rgba(255,255,255,.8)' }}>
              홍해·물류·금융 허브 경쟁에서 사우디와 충돌 잦아진 UAE, 독자 에너지 생산 확대 선택.
            </p>
            <p className="mono" style={{ color: 'rgba(255,255,255,.45)' }}>
              한국 에너지 공급망 다각화 압박 가중
            </p>
          </div>
        </div>
        <PageDots active={4} />
      </div>

      {/* ── 06 비트코인 ───────────────────────────────────── */}
      <div className="card bg-noir grain scratch">
        <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p className="mono" style={{ color: 'rgba(255,255,255,.45)', letterSpacing: '.06em' }}>
              CRYPTO · 05 / 05
            </p>
          </div>
          <h3 className="display-l" style={{ color: 'var(--paper)', fontSize: 44, lineHeight: 1.1 }}>
            비트코인<br />7만달러 재진입<br />
            <span style={{ color: 'var(--blood)' }}>인플레이션에 발목</span>
          </h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p className="body-l" style={{ color: 'var(--paper)' }}>
                <span className="hl">거시 불확실성 속<br />자금 이탈 우려</span>
              </p>
              <p className="body-m" style={{ color: 'rgba(255,255,255,.75)' }}>
                전문가들, 단순 기술적 조정 넘어 유가 급등·물가 불안에 따른 본격 매도세 분석.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="cutout" style={{ width: 80, height: 60, transform: 'rotate(-3deg)' }}>
                <span style={{ fontSize: 9 }}>CHART</span>
              </div>
              <p className="mono" style={{ color: 'rgba(255,255,255,.4)' }}>~$70,000 USD</p>
            </div>
          </div>
        </div>
        <PageDots active={5} />
      </div>

      {/* ── 07 CTA ────────────────────────────────────────── */}
      <div className="card bg-noir grain scratch" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse at 50% 40%, #1c2b1a 0%, #0a0a0d 65%)',
        }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, opacity: 0.08 }} className="checker-noir" />
        <div style={{
          position: 'relative', zIndex: 5,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '100%', padding: '48px 32px',
          textAlign: 'center', gap: 0,
        }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--paper)',
            color: 'var(--ink)',
            borderRadius: 100,
            padding: '7px 20px',
            fontFamily: 'var(--f-mono)',
            fontSize: 12,
            letterSpacing: '.12em',
            fontWeight: 700,
            marginBottom: 32,
          }}>
            ECON NEWS
          </div>
          <h3 style={{
            color: 'var(--paper)',
            fontSize: 42,
            lineHeight: 1.2,
            fontFamily: 'var(--f-display)',
            fontWeight: 900,
            marginBottom: 20,
          }}>
            경제 트렌드는?<br />'제이뉴스'
          </h3>
          <p style={{
            color: 'rgba(255,255,255,.65)',
            fontSize: 15,
            lineHeight: 1.8,
            marginBottom: 44,
          }}>
            매일 쏟아지는 경제 핫뉴스<br />
            지금 팔로우하고 놓치지 마세요.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            <button style={{
              width: 58, height: 58, borderRadius: '50%',
              background: 'rgba(255,255,255,.1)',
              border: '1px solid rgba(255,255,255,.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button style={{
              width: 58, height: 58, borderRadius: '50%',
              background: 'rgba(255,255,255,.1)',
              border: '1px solid rgba(255,255,255,.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button style={{
              width: 58, height: 58, borderRadius: '50%',
              background: 'rgba(255,255,255,.1)',
              border: '1px solid rgba(255,255,255,.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
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
