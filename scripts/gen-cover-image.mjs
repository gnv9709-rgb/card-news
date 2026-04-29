#!/usr/bin/env node
/**
 * Higgsfield AI로 커버 이미지를 생성하고 public/generated/ 에 저장합니다.
 *
 * 사용법:
 *   HIGGSFIELD_API_KEY=your_key node scripts/gen-cover-image.mjs
 *   HIGGSFIELD_API_KEY=your_key node scripts/gen-cover-image.mjs "custom prompt"
 *   HIGGSFIELD_API_KEY=your_key node scripts/gen-cover-image.mjs "prompt" cinematic_studio_2_5
 *
 * 모델 옵션:
 *   cinematic_studio_2_5  — 시네마틱 스틸, 4K (기본값, 커버용)
 *   soul_cinematic        — 시네마틱 컨셉아트
 *   nano_banana_2         — 범용 고품질 4K
 *   gpt_image_2           — 텍스트 렌더링 강점
 */

import { createWriteStream, mkdirSync } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'generated')

const API_KEY = process.env.HIGGSFIELD_API_KEY
if (!API_KEY) {
  console.error('❌  HIGGSFIELD_API_KEY 환경변수가 필요합니다.')
  console.error('   실행: HIGGSFIELD_API_KEY=your_key node scripts/gen-cover-image.mjs')
  process.exit(1)
}

const BASE_URL = 'https://mcp.higgsfield.ai'

const DEFAULT_PROMPT = `
Dramatic editorial photo for a Korean economic news card cover.
Dark noir atmosphere. Close-up of a fractured glass globe splitting apart,
with stock market numbers and oil barrel silhouettes dissolving into
dark shadows. Cinematic, high contrast. Dark background with warm amber
highlights and cool teal accents. No text. Photorealistic.
Magazine quality, editorial style.
`.trim()

const prompt = process.argv[2] ?? DEFAULT_PROMPT
const model  = process.argv[3] ?? 'cinematic_studio_2_5'

async function apiRequest(method, endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API 오류 (${res.status}) ${endpoint}: ${err}`)
  }
  return res.json()
}

async function pollJob(jobId, maxWaitMs = 120_000) {
  const start = Date.now()
  while (Date.now() - start < maxWaitMs) {
    await new Promise(r => setTimeout(r, 3000))
    process.stdout.write('.')

    const data = await apiRequest('GET', `/v1/generations/${jobId}`)
    if (data.status === 'completed') {
      process.stdout.write('\n')
      return data
    }
    if (data.status === 'failed') {
      throw new Error(`생성 실패: ${JSON.stringify(data)}`)
    }
  }
  throw new Error('타임아웃: 120초 초과')
}

async function generate() {
  console.log('🎨  이미지 생성 중...')
  console.log(`   모델: ${model}`)
  console.log(`   프롬프트: ${prompt.slice(0, 80)}...`)

  const job = await apiRequest('POST', '/v1/generations/image', {
    model,
    prompt,
    aspect_ratio: '3:4',
    resolution: '2k',
    count: 1,
  })

  console.log(`   Job ID: ${job.id}`)

  const result = await pollJob(job.id)
  const imageUrl = result.results?.rawUrl
  if (!imageUrl) throw new Error(`이미지 URL 없음: ${JSON.stringify(result)}`)

  console.log(`✅  생성 완료: ${imageUrl}`)

  mkdirSync(OUT_DIR, { recursive: true })
  const filename = `cover-${Date.now()}.png`
  const outPath = path.join(OUT_DIR, filename)

  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) throw new Error(`이미지 다운로드 실패: ${imgRes.status}`)
  await pipeline(imgRes.body, createWriteStream(outPath))

  console.log(`💾  저장 완료: public/generated/${filename}`)
  console.log(`   React에서: <img src="/generated/${filename}" />`)

  return `/generated/${filename}`
}

generate().catch(err => {
  console.error('❌ ', err.message)
  process.exit(1)
})
