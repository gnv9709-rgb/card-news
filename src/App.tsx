import { useState, useEffect } from 'react'
import './App.css'
import { NewsPanel } from './components/news/NewsPanel'

const HIGHLIGHT_COLORS = ['#8be8d4', '#ffe14a', '#ff9bd8', '#a8ff8a', '#ffb37a']
const COVER_BGS = [
  { cls: 'bg-noir',  hex: '#15151a', border: undefined },
  { cls: 'bg-deep',  hex: '#0F1D3A', border: undefined },
  { cls: 'bg-royal', hex: '#133FA6', border: undefined },
  { cls: 'bg-bone',  hex: '#EFE6D3', border: '#0d0d10' },
]

export default function App() {
  const [grain, setGrain] = useState(0.55)
  const [cardScale, setCardScale] = useState(1)
  const [mintColor, setMintColor] = useState('#8be8d4')
  const [coverBg, setCoverBg] = useState('bg-noir')

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--grain', grain.toString())
    root.style.setProperty('--card-w', `${640 * cardScale}px`)
    root.style.setProperty('--card-h', `${800 * cardScale}px`)
    root.style.setProperty('--mint', mintColor)
  }, [grain, cardScale, mintColor])

  return (
    <>
      {/* ── Page header ─────────────────────────── */}
      <div className="pagehead">
        <h1>카드뉴스<br /><em>디자인 시스템</em></h1>
        <div>
          <div className="sub">
            Vintage collage / highlighter / paper-cutout 시스템<br />
            인스타 카드뉴스 4:5 (1080×1350) 기준<br />
            한글 디스플레이 · 형광 강조 · 그레인 텍스처
          </div>
          <div className="meta">
            <span><b>v</b> 0.1.0</span>
            <span><b>ratio</b> 4:5</span>
            <span><b>safe area</b> 56px</span>
            <span><b>tokens</b> 18</span>
          </div>
        </div>
      </div>

      <div className="wrap">

        {/* ── 00 NEWS ─────────────────────────────── */}
        <div className="sect">
          <span className="num">00</span>
          <h2>Today News &mdash; 오늘의 뉴스</h2>
          <span className="desc">네이버 검색 API · 경제 · 사회</span>
        </div>
        <NewsPanel />

        {/* ── 01 COLOR ────────────────────────────── */}
        <div className="sect">
          <span className="num">01</span>
          <h2>Color &mdash; 색</h2>
          <span className="desc">surfaces · accents · ink</span>
        </div>

        <div className="panel" style={{ marginBottom: 16 }}>
          <h4>Surfaces · 배경 4종 <span>주조색</span></h4>
          <div className="swatches">
            <div className="sw">
              <div className="chip checker-noir" style={{ position: 'relative', overflow: 'hidden' }} />
              <div className="lbl"><b>Checker Noir</b><span>#15151A</span></div>
            </div>
            <div className="sw">
              <div className="chip" style={{ background: 'var(--bg-deep)' }} />
              <div className="lbl"><b>Deep Navy</b><span>#0F1D3A</span></div>
            </div>
            <div className="sw">
              <div className="chip" style={{ background: 'var(--bg-royal)' }} />
              <div className="lbl"><b>Royal Blue</b><span>#133FA6</span></div>
            </div>
            <div className="sw">
              <div className="chip" style={{ background: 'var(--bg-bone)' }} />
              <div className="lbl"><b>Bone Paper</b><span>#EFE6D3</span></div>
            </div>
          </div>
        </div>

        <div className="panel">
          <h4>Accents · 강조색 <span>제한적 사용</span></h4>
          <div className="swatches">
            <div className="sw">
              <div className="chip" style={{ background: 'var(--mint)' }} />
              <div className="lbl"><b>Highlighter Mint</b><span>#8BE8D4</span></div>
            </div>
            <div className="sw">
              <div className="chip" style={{ background: 'var(--acid)' }} />
              <div className="lbl"><b>Acid Yellow</b><span>#FFE14A</span></div>
            </div>
            <div className="sw">
              <div className="chip" style={{ background: 'var(--blood)' }} />
              <div className="lbl"><b>Stamp Red</b><span>#C2392B</span></div>
            </div>
            <div className="sw">
              <div className="chip" style={{ background: 'var(--paper)' }} />
              <div className="lbl"><b>Paper Cream</b><span>#F4EDE0</span></div>
            </div>
          </div>
          <div className="mono" style={{ marginTop: 16, color: 'rgba(0,0,0,.55)' }}>
            한 카드당 강조색 <b>1개</b>만 사용. Mint = 본문 하이라이트 / Acid = 화살표·도형 / Red = 도장·라벨.
          </div>
        </div>


        {/* ── 02 TYPE ─────────────────────────────── */}
        <div className="sect">
          <span className="num">02</span>
          <h2>Type &mdash; 타입</h2>
          <span className="desc">display / body / hand / mono</span>
        </div>

        <div className="type-grid">
          <div className="type-row">
            <div className="label"><b>Display XL</b>72 / 95% / -1%<br />Black Han Sans</div>
            <div><h3 className="display-xl">"찐팬 100명"이 보물이다</h3></div>
          </div>
          <div className="type-row">
            <div className="label"><b>Display L</b>52 / 100%<br />Black Han Sans</div>
            <div><h3 className="display-l">팔로워 1만이 아니라</h3></div>
          </div>
          <div className="type-row">
            <div className="label"><b>Body Large</b>24 / 150% / 500<br />Noto Sans KR</div>
            <div><p className="body-l">내 이야기에 공감하고 기꺼이 지갑을 여는 진짜 팬.</p></div>
          </div>
          <div className="type-row">
            <div className="label"><b>Body Medium</b>18 / 160% / 400<br />Noto Sans KR</div>
            <div><p className="body-m">단순한 팔로워 숫자는 진짜 성공을 보장해 주지 않습니다. 우리가 누군가를 팔로우할 때, 거의 에너지가 들어가지 않거든요.</p></div>
          </div>
          <div className="type-row">
            <div className="label"><b>Hand</b>22 / 155%<br />Gowun Dodum</div>
            <div><p className="hand">우리가 공부하는 구간 ↘ 모르는 사이 → 아는 사이</p></div>
          </div>
          <div className="type-row">
            <div className="label"><b>Mono / Caption</b>13 / 160% / .03em<br />JetBrains Mono</div>
            <div><p className="mono">CARD 03 / 07 — @marketing_hun · 2026.04</p></div>
          </div>
        </div>


        {/* ── 03 HIGHLIGHT ────────────────────────── */}
        <div className="sect">
          <span className="num">03</span>
          <h2>Highlight &mdash; 형광 강조</h2>
          <span className="desc">signature element</span>
        </div>

        <div className="grid-3">
          <div className="panel" style={{ background: 'var(--bg-noir)', color: 'var(--paper)' }}>
            <h4 style={{ color: 'rgba(255,255,255,.5)' }}>A. Inline (기본)</h4>
            <p className="body-l" style={{ color: 'var(--paper)' }}>팔로워는 많은데<br /><span className="hl">진짜 영향력이 있는건가?</span></p>
          </div>
          <div className="panel" style={{ background: 'var(--bg-noir)', color: 'var(--paper)' }}>
            <h4 style={{ color: 'rgba(255,255,255,.5)' }}>B. Drop-shadow</h4>
            <p className="body-l" style={{ color: 'var(--paper)' }}><span className="hl hl-shadow">찐팬 100명이</span><br /><span className="hl hl-shadow">보물이다</span></p>
          </div>
          <div className="panel" style={{ background: 'var(--bg-noir)', color: 'var(--paper)' }}>
            <h4 style={{ color: 'rgba(255,255,255,.5)' }}>C. Tilted</h4>
            <p className="body-l" style={{ color: 'var(--paper)' }}><span className="hl hl-tilt">우리가 현실에서</span><br /><span className="hl hl-tilt">'찐친'을 사귀는 것과 똑같다</span></p>
          </div>
        </div>

        <div className="panel" style={{ marginTop: 16 }}>
          <div className="mono" style={{ color: 'rgba(0,0,0,.65)' }}>
            <b style={{ color: 'var(--ink)' }}>규칙</b><br />
            · 강조 박스는 한 카드에 <b>최대 3줄</b>까지<br />
            · 본문에 띄워서 손으로 칠한 듯한 느낌. 줄 간격은 1.55 이상<br />
            · 검은/네이비 배경 위에서만 사용. Bone Paper 위에선 형광이 죽으므로 <b>Acid Yellow</b>로 대체
          </div>
        </div>


        {/* ── 04 COLLAGE ──────────────────────────── */}
        <div className="sect">
          <span className="num">04</span>
          <h2>Collage &mdash; 콜라주 요소</h2>
          <span className="desc">cutouts · arrows · stamps · stickers</span>
        </div>

        <div className="grid-3">
          <div className="panel">
            <h4>Cut-out · 종이 컷아웃 <span>흰 테두리 6px</span></h4>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '16px 0' }}>
              <div className="cutout" style={{ width: 130, height: 160, transform: 'rotate(-3deg)' }}><span>HAND</span></div>
              <div className="cutout halftone" style={{ width: 130, height: 160, transform: 'rotate(2deg)' }}><span style={{ background: 'none', border: '1px dashed rgba(0,0,0,.4)' }}>HALF-TONE</span></div>
            </div>
            <div className="mono" style={{ color: 'rgba(0,0,0,.6)' }}>실제 사용시: 흑백/하프톤 처리한 사진 + 6px 흰 테두리 + 8px 그림자 + 2~3° 회전</div>
          </div>

          <div className="panel">
            <h4>Arrows · 손그림 화살표 <span>방향성 안내</span></h4>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end', padding: '16px 0', height: 140 }}>
              <div className="arrow-down ink" />
              <div className="arrow-down ink tiny" />
              <div className="arrow-down" style={{ background: 'var(--blood)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <span className="hand" style={{ fontSize: 14 }}>우리가 공부하는 구간</span>
                <svg width="60" height="20" viewBox="0 0 60 20"><path d="M5 10 Q 30 0 55 10" stroke="#0d0d10" strokeWidth="2" fill="none" /><path d="M48 6 L55 10 L50 14" stroke="#0d0d10" strokeWidth="2" fill="none" /></svg>
              </div>
            </div>
            <div className="mono" style={{ color: 'rgba(0,0,0,.6)' }}>크기 56–96px. 손글씨 캡션과 함께 다이어그램 만들 때 사용</div>
          </div>

          <div className="panel">
            <h4>Stamps &amp; Stickers · 라벨 <span>강조 / CTA</span></h4>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '24px 0', flexWrap: 'wrap' }}>
              <span className="stamp">중요</span>
              <span className="stamp" style={{ color: 'var(--ink)', borderColor: 'var(--ink)', transform: 'rotate(3deg)' }}>CARD 1/7</span>
              <span className="sticker" style={{ fontFamily: 'var(--f-display)', fontSize: 18 }}>무료자료</span>
            </div>
            <div className="mono" style={{ color: 'rgba(0,0,0,.6)' }}>Stamp = 회전 -6°/+3°, 외곽선만. Sticker = 흰 종이 위 검은 외곽선 + 회전</div>
          </div>
        </div>


        {/* ── 05 CARD TEMPLATES ───────────────────── */}
        <div className="sect">
          <span className="num">05</span>
          <h2>Card Templates &mdash; 7장 시퀀스</h2>
          <span className="desc">cover · thesis · explainer · diagram · compare · quote · cta</span>
        </div>

        <div className="cards-row" id="cards">

          {/* 01 COVER */}
          <div className={`card ${coverBg} grain scratch`}>
            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }} className="checker-noir" />
            <div className="pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="cutout" style={{ width: 130, height: 170, transform: 'rotate(-6deg)', marginBottom: 24 }}><span>CAMERA</span></div>
                <div className="mono" style={{ color: 'rgba(255,255,255,.55)', marginBottom: 12 }}>EP.04 / GROWTH NOTES</div>
              </div>
              <div>
                <h2 className="display-l" style={{ color: 'var(--paper)', marginBottom: 8 }}>팔로워 1만이 아니라</h2>
                <h2 className="display-xl" style={{ color: 'var(--paper)' }}><span className="hl hl-shadow">"진짜 팬 100명"</span><br />이 보물이다</h2>
              </div>
            </div>
            <div className="pageno" style={{ color: 'var(--mint)' }}><i className="on" /><i /><i /><i /><i /><i /><i /></div>
          </div>

          {/* 02 THESIS */}
          <div className="card bg-noir grain scratch">
            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }} className="checker-noir" />
            <div className="pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
              <p className="body-l" style={{ color: 'var(--paper)' }}><span className="hl">팔로워는 많은데 진짜 영향력이 있는건가?</span></p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 28 }}>
                <span style={{ width: 1, height: 14, background: 'var(--mint)' }} />
                <span style={{ width: 1, height: 14, background: 'var(--mint)' }} />
                <span style={{ width: 1, height: 14, background: 'var(--mint)' }} />
              </div>
              <p className="body-l" style={{ color: 'var(--paper)' }}><span className="hl">내 이야기에 공감하고 기꺼이 지갑을 여는 '찐팬 100명'이 훨씬 강력하다는 건 요즘 다 아실겁니다.</span></p>
              <p className="body-m" style={{ color: 'rgba(255,255,255,.85)' }}><span className="hl">단순한 팔로워 숫자는 우리의 진짜 성공을 보장해 주지 않거든요.</span></p>
              <p className="body-m" style={{ color: 'rgba(255,255,255,.85)' }}><span className="hl">그럼 찐팬은 어떻게 모으는걸까?</span></p>
            </div>
            <div className="pageno" style={{ color: 'var(--mint)' }}><i /><i className="on" /><i /><i /><i /><i /><i /></div>
          </div>

          {/* 03 EXPLAINER */}
          <div className="card bg-deep grain">
            <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <h3 className="display-l" style={{ color: 'var(--paper)', fontSize: 36 }}>찐팬을 만드는 비결은<br />아주 단순합니다.</h3>
              <div style={{ marginLeft: 'auto', maxWidth: 320, textAlign: 'right' }}>
                <span className="hl">우리가 현실에서 '찐친'을<br />사귀는 과정과 똑같거든요.</span>
              </div>
              <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
                <div className="halftone" style={{ width: 240, height: 280, borderRadius: '50% 48% 52% 50%', transform: 'rotate(-4deg)', borderWidth: 5, display: 'grid', placeItems: 'center' }}>
                  <span style={{ background: 'rgba(255,255,255,.7)', padding: '4px 8px', fontFamily: 'var(--f-mono)', fontSize: 10 }}>PORTRAIT · HALFTONE</span>
                </div>
              </div>
            </div>
            <div className="pageno"><i /><i /><i className="on" /><i /><i /><i /><i /></div>
          </div>

          {/* 04 DIAGRAM */}
          <div className="card bg-noir grain scratch">
            <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse at 50% 80%, #2a2520 0%, #0a0a0d 70%)' }} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'repeating-linear-gradient(180deg, rgba(255,220,150,.04) 0 2px, transparent 2px 8px)' }} />
            <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 14, zIndex: 5 }}>
              <p className="hand" style={{ color: 'var(--paper)', textAlign: 'center' }}>모르는 사이</p>
              <div className="arrow-down" style={{ background: 'var(--paper)', margin: '0 auto' }} />
              <p className="hand" style={{ color: 'var(--paper)', textAlign: 'center' }}>아 그냥 우리 아는사이~ <span style={{ opacity: .7 }}>( 팔로우 버튼만 누른 거 )</span></p>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, justifyContent: 'center', margin: '4px 0' }}>
                <div className="arrow-down acid" />
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="40" height="60" viewBox="0 0 40 60"><path d="M5 5 Q 35 30 5 55" stroke="#f4ede0" strokeWidth="1.5" fill="none" /></svg>
                  <span className="hand" style={{ color: 'var(--paper)', fontSize: 14 }}>우리가 공부하는<br />구간</span>
                </div>
              </div>
              <p className="hand" style={{ color: 'var(--paper)', textAlign: 'center' }}>아 이 사람 어쩌구 <span style={{ opacity: .7 }}>(찐친 / 내가 뭐 하면 다 응원해줌)</span></p>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'flex-end' }}>
                <div style={{ textAlign: 'center', maxWidth: 220 }}>
                  <div className="cutout" style={{ width: 80, height: 100, margin: '0 auto 12px', transform: 'rotate(-4deg)' }}><span>A</span></div>
                  <p className="body-m" style={{ color: 'var(--paper)', lineHeight: 1.4, fontSize: 13 }}>멋진 척, 있는 척, 대단한 척<br />계속 말이 달라짐<br />자기 말만 하고 안 들어줌</p>
                </div>
                <div style={{ textAlign: 'center', maxWidth: 220 }}>
                  <div className="cutout halftone" style={{ width: 80, height: 100, margin: '0 auto 12px', transform: 'rotate(3deg)' }}><span style={{ background: 'none' }}>B</span></div>
                  <p className="body-m" style={{ color: 'var(--paper)', lineHeight: 1.4, fontSize: 13 }}>엄청 솔직함<br />확실한 목표가 있음<br />내 이야기 많이 들어줌</p>
                </div>
              </div>
            </div>
            <div className="pageno" style={{ color: 'var(--mint)' }}><i /><i /><i /><i className="on" /><i /><i /><i /></div>
          </div>

          {/* 05 QUOTE */}
          <div className="card bg-bone grain">
            <div className="pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div><span className="stamp">PRINCIPLE</span></div>
              <div>
                <h3 className="display-xl" style={{ color: 'var(--ink)', fontSize: 64 }}>진짜 신뢰는<br /><span style={{ background: 'var(--acid)', padding: '0 .15em', boxShadow: '4px 4px 0 var(--ink)' }}>시간</span>이<br />만든다.</h3>
                <p className="body-m" style={{ color: 'rgba(0,0,0,.7)', marginTop: 24, maxWidth: 380 }}>팔로워 한 명을 만드는 데 1초가 걸리지만, 찐팬 한 명을 만드는 데는 100시간이 든다.</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span className="mono" style={{ color: 'rgba(0,0,0,.55)' }}>— GROWTH NOTES, EP.04</span>
                <div className="cutout" style={{ width: 120, height: 100, transform: 'rotate(4deg)', borderColor: 'var(--ink)', background: 'repeating-linear-gradient(135deg, #0d0d10 0 6px, #1a1a1f 6px 12px)' }}><span>STAMP</span></div>
              </div>
            </div>
            <div className="pageno"><i /><i /><i /><i /><i className="on" /><i /><i /></div>
          </div>

          {/* 06 COMPARE */}
          <div className="card bg-deep grain">
            <div className="pad" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="mono" style={{ color: 'rgba(255,255,255,.5)' }}>CHECKLIST · 06 / 07</div>
              <h3 className="display-l" style={{ color: 'var(--paper)', fontSize: 36 }}>찐팬은 이 4가지를<br />받고 싶어합니다.</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
                {[
                  { n: '01', title: '반복적으로 보이기', desc: '매일 같은 시간 · 같은 채널에 등장한다' },
                  { n: '02', title: '한 가지 주제로 좁히기', desc: '어디서든 인지될 수 있는 한 단어를 가진다' },
                  { n: '03', title: '속마음 보여주기', desc: '실패와 의심까지 솔직하게 공유한다' },
                  { n: '04', title: '먼저 베풀기', desc: '대가 없이 무료 자료부터 보낸다' },
                ].map(({ n, title, desc }) => (
                  <div key={n} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--f-display)', color: 'var(--mint)', fontSize: 32, minWidth: 48 }}>{n}</span>
                    <div>
                      <p className="body-l" style={{ color: 'var(--paper)', marginBottom: 4 }}><span className="hl">{title}</span></p>
                      <p className="body-m" style={{ color: 'rgba(255,255,255,.7)', fontSize: 15 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pageno"><i /><i /><i /><i /><i /><i className="on" /><i /></div>
          </div>

          {/* 07 CTA */}
          <div className="card bg-royal grain">
            <div className="pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3 className="display-l" style={{ color: 'var(--paper)', fontSize: 36 }}>그건 다음 카드뉴스에서<br />말씀드리겠습니다</h3>
              <div style={{ position: 'relative', alignSelf: 'center', width: 360, height: 280 }}>
                <div className="halftone" style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 30%, 60% 10%, 100% 0, 95% 100%, 55% 90%, 0 70%)', border: 0, boxShadow: 'none' }} />
                <svg style={{ position: 'absolute', right: -10, top: -10 }} width="120" height="120" viewBox="0 0 120 120">
                  <path d="M30 60 Q 80 30 110 60" stroke="#FFE14A" strokeWidth="6" fill="none" strokeLinecap="round" />
                  <path d="M30 60 Q 80 60 110 60" stroke="#FFE14A" strokeWidth="6" fill="none" strokeLinecap="round" />
                  <path d="M30 60 Q 80 90 110 60" stroke="#FFE14A" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="body-l" style={{ color: 'var(--paper)', textAlign: 'right', marginBottom: 12 }}><span className="hl">프로필 링크에서<br />무료로 받아두세요</span></p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div className="sticker" style={{ background: 'var(--paper)', display: 'flex', gap: 10, alignItems: 'center', transform: 'rotate(2deg)', padding: '10px 14px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'repeating-linear-gradient(45deg, #15151a 0 4px, #2a2a30 4px 8px)' }} />
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, lineHeight: 1.4, color: 'var(--ink)' }}>
                      <b style={{ fontSize: 12 }}>@growth_notes</b><br />
                      팔로워 3,873 · 팔로잉 0<br />
                      <span style={{ color: 'var(--blood)' }}>▶ 무료자료 받기</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pageno"><i /><i /><i /><i /><i /><i /><i className="on" /></div>
          </div>

        </div>


        {/* ── 06 GRID & SPACING ───────────────────── */}
        <div className="sect">
          <span className="num">06</span>
          <h2>Grid &amp; Spacing</h2>
          <span className="desc">safe area · rhythm</span>
        </div>

        <div className="grid-2">
          <div className="panel">
            <h4>Card geometry <span>1080 × 1350</span></h4>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', background: 'var(--paper-2)', border: '1px solid rgba(0,0,0,.2)' }}>
              <div style={{ position: 'absolute', inset: '9.3%', border: '1px dashed rgba(0,0,0,.3)' }} />
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(0,0,0,.08)' }} />
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,.08)' }} />
              <div style={{ position: 'absolute', left: 12, top: 12, fontFamily: 'var(--f-mono)', fontSize: 10, color: 'rgba(0,0,0,.55)' }}>SAFE AREA · 56px</div>
              <div style={{ position: 'absolute', right: 12, bottom: 12, fontFamily: 'var(--f-mono)', fontSize: 10, color: 'rgba(0,0,0,.55)' }}>RATIO 4:5</div>
            </div>
          </div>

          <div className="panel">
            <h4>Spacing scale <span>4px base</span></h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { w:  4, label: 's1 — 4px' },
                { w:  8, label: 's2 — 8px' },
                { w: 12, label: 's3 — 12px' },
                { w: 16, label: 's4 — 16px · base text' },
                { w: 24, label: 's5 — 24px · paragraph' },
                { w: 32, label: 's6 — 32px · block' },
                { w: 48, label: 's7 — 48px · section' },
                { w: 64, label: 's8 — 64px · gutter' },
                { w: 96, label: 's9 — 96px · cover hero' },
              ].map(({ w, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: w, height: 14, background: 'var(--ink)', flexShrink: 0 }} />
                  <span className="mono">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* ── 07 DO & DON'T ───────────────────────── */}
        <div className="sect">
          <span className="num">07</span>
          <h2>Do &amp; Don't</h2>
          <span className="desc">tone of voice</span>
        </div>

        <div className="grid-2">
          <div className="panel" style={{ borderLeft: '4px solid var(--mint)' }}>
            <h4 style={{ color: 'var(--ink)' }}>DO · 권장</h4>
            <ul className="body-m" style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>한 카드에 핵심 메시지 <b>1개</b>만 — 나머진 그 메시지를 받쳐주는 역할</li>
              <li>형광 강조는 <b>3줄 이하</b>로 — 너무 많으면 강조가 사라진다</li>
              <li>이미지는 흑백·하프톤으로 <b>톤을 통일</b>해서 컬러 대비 만들기</li>
              <li>그레인·스크래치 텍스처를 항상 <b>최상단 레이어</b>로</li>
              <li>회전은 ±2~6° 사이 — 너무 똑바르면 디지털 느낌, 너무 비뚤면 산만함</li>
            </ul>
          </div>
          <div className="panel" style={{ borderLeft: '4px solid var(--blood)' }}>
            <h4 style={{ color: 'var(--ink)' }}>DON'T · 지양</h4>
            <ul className="body-m" style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
              <li>이모지 — 콜라주 무드와 충돌. 손글씨 화살표나 도장으로 대체</li>
              <li>그라디언트 배경 — 단색 + 그레인이 핵심</li>
              <li>둥근 모서리 — 컷아웃은 직각 또는 손으로 자른 듯한 거친 가장자리</li>
              <li>Mint + Royal Blue 동시 사용 — 한 카드 한 강조색</li>
              <li>한 카드에 사진 3장 이상 — 최대 2장, 크기 차이를 크게</li>
            </ul>
          </div>
        </div>

      </div>


      {/* ── Tweaks panel ────────────────────────────── */}
      <div className="tweaks">
        <h5>Tweaks</h5>
        <label>
          Grain intensity
          <input type="range" min="0" max="1" step="0.05" value={grain} onChange={e => setGrain(parseFloat(e.target.value))} />
        </label>
        <label>
          Card scale
          <input type="range" min="0.6" max="1.2" step="0.05" value={cardScale} onChange={e => setCardScale(parseFloat(e.target.value))} />
        </label>
        <label style={{ marginTop: 12 }}>Highlight color</label>
        <div className="row">
          {HIGHLIGHT_COLORS.map(c => (
            <button key={c} className="swp" style={{ background: c }} onClick={() => setMintColor(c)} aria-label={c} />
          ))}
        </div>
        <label style={{ marginTop: 12 }}>Cover background</label>
        <div className="row">
          {COVER_BGS.map(({ cls, hex, border }) => (
            <button key={cls} className="swp" style={{ background: hex, borderColor: border ?? undefined }} onClick={() => setCoverBg(cls)} aria-label={cls} />
          ))}
        </div>
      </div>
    </>
  )
}
