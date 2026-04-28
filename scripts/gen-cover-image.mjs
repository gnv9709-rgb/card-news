#!/usr/bin/env node
/**
 * fal.ai nano-banana-2 로 커버 이미지를 생성하고
 * public/generated/ 폴더에 저장합니다.
 *
 * 사용법:
 *   FAL_KEY=your_key node scripts/gen-cover-image.mjs
 *   FAL_KEY=your_key node scripts/gen-cover-image.mjs "custom prompt here"
 */

import { createWriteStream, mkdirSync } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'generated')

const FAL_KEY = process.env.FAL_KEY
if (!FAL_KEY) {
  console.error('❌  FAL_KEY 환경변수가 필요합니다.')
  console.error('   실행: FAL_KEY=your_key node scripts/gen-cover-image.mjs')
  process.exit(1)
}

const DEFAULT_PROMPT = `
Dramatic editorial photo for a Korean economic news card cover.
Dark noir atmosphere. Close-up of a fractured glass globe splitting apart,
with stock market numbers and oil barrel silhouettes dissolving into
dark shadows. Cinematic, high contrast. Dark background with warm amber
highlights and cool teal accents. No text. Photorealistic.
Magazine quality, editorial style.
`.trim()

const prompt = process.argv[2] ?? DEFAULT_PROMPT
const seed = parseInt(process.argv[3] ?? '42', 10)

async function generate() {
  console.log('🎨  이미지 생성 중...')
  console.log(`   모델: fal-ai/nano-banana-2`)
  console.log(`   프롬프트: ${prompt.slice(0, 80)}...`)

  // fal.ai REST API — queue 방식 (비동기)
  const submitRes = await fetch('https://queue.fal.run/fal-ai/nano-banana-2', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      image_size: 'portrait_4_3',  // 1080×1350 근사치
      num_images: 1,
      seed,
    }),
  })

  if (!submitRes.ok) {
    const err = await submitRes.text()
    throw new Error(`Submit 실패 (${submitRes.status}): ${err}`)
  }

  const { request_id, response_url, status_url } = await submitRes.json()
  console.log(`   요청 ID: ${request_id}`)

  // 폴링 — 완료될 때까지 대기
  let result = null
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 2000))
    process.stdout.write('.')

    const statusRes = await fetch(status_url, {
      headers: { 'Authorization': `Key ${FAL_KEY}` },
    })
    const status = await statusRes.json()

    if (status.status === 'COMPLETED') {
      process.stdout.write('\n')
      // response_url 에서 최종 결과 가져오기
      const resultRes = await fetch(response_url, {
        headers: { 'Authorization': `Key ${FAL_KEY}` },
      })
      result = await resultRes.json()
      break
    }
    if (status.status === 'FAILED') {
      throw new Error(`생성 실패: ${JSON.stringify(status)}`)
    }
  }

  if (!result) throw new Error('타임아웃: 120초 초과')

  const imageUrl = result.images?.[0]?.url
  if (!imageUrl) throw new Error(`이미지 URL 없음: ${JSON.stringify(result)}`)

  console.log(`✅  생성 완료: ${imageUrl}`)

  // 로컬에 저장
  mkdirSync(OUT_DIR, { recursive: true })
  const filename = `cover-${Date.now()}.png`
  const outPath = path.join(OUT_DIR, filename)

  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) throw new Error(`이미지 다운로드 실패: ${imgRes.status}`)
  await pipeline(imgRes.body, createWriteStream(outPath))

  console.log(`💾  저장 완료: public/generated/${filename}`)
  console.log(`   React에서: import coverImg from '/generated/${filename}'`)
  console.log(`   또는:      <img src="/generated/${filename}" />`)

  return `/generated/${filename}`
}

generate().catch(err => {
  console.error('❌ ', err.message)
  process.exit(1)
})
