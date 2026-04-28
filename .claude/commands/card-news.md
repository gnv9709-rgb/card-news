---
description: 네이버 뉴스 → 핫 뉴스 선택 → 피그마 카드뉴스 자동 생성 (7장 시퀀스)
argument-hint: [경제|사회|전체]  — 기본값: 전체
---

# /card-news — 카드뉴스 자동 생성

오늘의 네이버 뉴스를 분석해 가장 핫한 뉴스를 추천하고, 선택된 뉴스를 7장짜리 피그마 카드뉴스로 자동 생성합니다.

**카테고리 인수**: `$ARGUMENTS` (비어있으면 `전체`)

---

## PHASE 1 — 뉴스 수집

프로젝트 루트에서 아래 스크립트를 실행합니다:

```bash
node scripts/fetch-naver-news.mjs $ARGUMENTS
```

스크립트가 실패하면(Node 버전 미지원, 네트워크 오류 등) `.env.local`에서 직접 인증 정보를 읽어 네이버 뉴스 API를 호출합니다:

```
GET https://openapi.naver.com/v1/search/news.json?query=경제&display=30&sort=date
Headers: X-Naver-Client-Id: {NAVER_CLIENT_ID}
         X-Naver-Client-Secret: {NAVER_CLIENT_SECRET}
```

오늘 날짜 뉴스만 필터링합니다 (pubDate 기준).

---

## PHASE 2 — 핫 뉴스 5개 선정

수집된 뉴스에서 다음 기준으로 **4~5개**를 선정합니다:

1. **파급력** — 경제·사회적 영향이 명확히 큰 뉴스
2. **스토리텔링 적합성** — 원인→결과, 문제→해결, 비교, 수치 포함 구조
3. **대중 관심도** — 일반인이 "이건 알아야 해"라고 공감할 내용
4. **시각화 가능성** — 카드 1장에 핵심을 담을 수 있는지

선정된 뉴스를 번호 목록으로 정리합니다:

```
[1] 제목 (출처 — 시간)
    한 줄 요약

[2] 제목 (출처 — 시간)
    한 줄 요약
...
```

---

## PHASE 3 — 사용자 선택 (AskUserQuestion)

**AskUserQuestion 도구**를 사용해 사용자에게 물어봅니다:

```
오늘의 핫 뉴스 TOP 5입니다. 어떤 뉴스로 카드뉴스를 만들까요?

[1] ...
[2] ...
[3] ...
[4] ...
[5] ...

번호를 입력해주세요 (예: 2)
또는 직접 주제를 입력하셔도 됩니다.
```

사용자가 번호 또는 직접 주제를 입력하면 해당 뉴스로 진행합니다.

---

## PHASE 4 — 카드뉴스 콘텐츠 설계

선택된 뉴스를 바탕으로 **7장 시퀀스** 콘텐츠를 한국어로 작성합니다.

### 카드 구조

| 번호 | 유형 | 목적 |
|------|------|------|
| 01 | COVER | 강렬한 제목 1문장, 독자의 관심을 끄는 훅 |
| 02 | THESIS | 핵심 질문/문제 제기 — "왜 이게 중요한가?" |
| 03 | EXPLAINER | 배경 설명 — 맥락과 원인 |
| 04 | DIAGRAM | 수치·관계·흐름 시각화 |
| 05 | QUOTE | 핵심 메시지 1문장 (인용 또는 결론) |
| 06 | COMPARE | 체크리스트, 비교표, 또는 핵심 포인트 3~4개 |
| 07 | CTA | 마무리 + 독자 행동 유도 |

### 각 카드별 출력 형식

```
CARD 01 — COVER
배경: bg-noir + checker
헤드라인(display-xl): "..."
서브(body-l): "..."
강조(hl): "..."

CARD 02 — THESIS
배경: bg-noir
본문 강조1: "..."
본문 강조2: "..."
질문: "..."

CARD 03 — EXPLAINER
배경: bg-deep
헤드라인: "..."
강조 인용: "..."
이미지 힌트: [어떤 종류의 이미지가 어울릴지]

CARD 04 — DIAGRAM
배경: bg-noir
다이어그램 구조: [계층형|흐름형|비교형]
항목들: ["항목1", "항목2", ...]
수치 데이터: [있으면]

CARD 05 — QUOTE
배경: bg-bone
핵심 문장(display-xl): "..."
부연 설명: "..."
출처 표기: "..."

CARD 06 — COMPARE
배경: bg-deep
헤드라인: "..."
항목1~4: [{번호, 제목, 설명}, ...]

CARD 07 — CTA
배경: bg-royal
헤드라인: "..."
행동 유도 문구: "..."
계정명(있으면): "@..."
```

---

## PHASE 5 — 피그마 카드뉴스 생성

### 디자인 시스템 토큰

```
카드 크기:   1080 × 1350px  (4:5 비율)
안전 영역:   56px 내부 패딩

배경:
  bg-noir   #15151A  — 체커 패턴 오버레이 가능
  bg-deep   #0F1D3A
  bg-royal  #133FA6
  bg-bone   #EFE6D3

강조색:
  mint  #8BE8D4  — 형광 하이라이트 (어두운 배경)
  acid  #FFE14A  — 화살표, 스탬프 (뼈 배경)
  blood #C2392B  — 스탬프, 라벨

폰트:
  Display  → Black Han Sans  72px/52px  lh:95%  ls:-1%
  Body L   → Noto Sans KR    24px       lh:150% fw:500
  Body M   → Noto Sans KR    18px       lh:160% fw:400
  Hand     → Gowun Dodum     22px       lh:155%
  Mono     → JetBrains Mono  13px       lh:160% ls:.03em

간격 스케일: 4/8/12/16/24/32/48/64/96px
```

### 실행 방법

1. `mcp__claude_ai_Figma__use_figma` 또는 `mcp__claude_ai_Figma__create_new_file` 도구로 새 Figma 파일을 생성합니다.
2. 파일 이름: `카드뉴스_YYYY-MM-DD_[뉴스제목 앞 10자]`
3. 7개의 프레임을 가로로 배열합니다 (프레임 간격 80px).
4. 각 프레임에 PHASE 4에서 설계한 콘텐츠를 배치합니다.

### 레이어 구조 (각 카드)

```
Frame [01~07]  1080×1350
  └─ Background  (rect, fill=배경색)
  └─ Checker/Grain  (overlay, opacity=55%)  — noir 계열만
  └─ Content Group
      ├─ Headline  (text, display font)
      ├─ Body      (text, body font)
      ├─ Highlight  (rect+text, mint/acid fill, opacity=85%)
      ├─ Cutout    (rect, white border 6px, rotate ±3°)  — 선택
      ├─ Stamp     (text, border only, rotate -6°/+3°)   — 선택
      └─ Arrow     (vector, 56~96px)                     — 선택
  └─ PageIndicator  (7개 점, 현재 카드 강조)
```

### 규칙

- 카드 1장에 강조색 **1가지만** 사용
- 형광 하이라이트 **최대 3줄**
- 회전은 ±2~6° 이내
- 이모지 사용 금지 (손글씨 화살표, 스탬프로 대체)

---

## PHASE 6 — 완료 보고

피그마 생성이 완료되면 다음을 보고합니다:

```
✅ 카드뉴스 생성 완료

주제: [선택된 뉴스 제목]
파일: [Figma 파일 이름 / URL]
카드: 7장 (01 COVER → 07 CTA)

카드별 핵심 메시지:
  01: [한 문장]
  02: [한 문장]
  ...
  07: [한 문장]

다음 단계:
  - Figma에서 이미지(하프톤 처리) 교체
  - 그레인/스크래치 텍스처 레이어 추가
  - 인스타그램 업로드 전 1080×1350 내보내기
```
