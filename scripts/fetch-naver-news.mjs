#!/usr/bin/env node
/**
 * Naver News fetcher — called by /card-news command.
 * Reads .env.local from cwd, fetches 경제 + 사회 news, prints JSON to stdout.
 * Usage: node scripts/fetch-naver-news.mjs [경제|사회|전체]
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// ── Load credentials ──────────────────────────────────────────────────────────
const envPath = resolve(process.cwd(), '.env.local')
let clientId = '', clientSecret = ''

try {
  const raw = readFileSync(envPath, 'utf-8')
  for (const line of raw.split('\n')) {
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    const val = line.slice(eq + 1).trim()
    if (key === 'NAVER_CLIENT_ID') clientId = val
    if (key === 'NAVER_CLIENT_SECRET') clientSecret = val
  }
} catch {
  process.stderr.write('.env.local 파일을 읽을 수 없습니다\n')
  process.exit(1)
}

if (!clientId || !clientSecret) {
  process.stderr.write('.env.local 에 NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 가 없습니다\n')
  process.exit(1)
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function clean(str) {
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

function isToday(pubDateStr) {
  const pub = new Date(pubDateStr)
  const now = new Date()
  return (
    pub.getFullYear() === now.getFullYear() &&
    pub.getMonth() === now.getMonth() &&
    pub.getDate() === now.getDate()
  )
}

async function fetchCategory(query, count = 30) {
  const params = new URLSearchParams({ query, display: String(count), start: '1', sort: 'date' })
  const url = `https://openapi.naver.com/v1/search/news.json?${params}`
  const res = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': clientId,
      'X-Naver-Client-Secret': clientSecret,
    },
  })
  if (!res.ok) {
    throw new Error(`네이버 API 오류 [${query}]: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  return data.items
    .filter(item => isToday(item.pubDate))
    .map(item => ({
      title: clean(item.title),
      description: clean(item.description),
      link: item.originallink || item.link,
      pubDate: item.pubDate,
      category: query,
    }))
}

// ── Main ──────────────────────────────────────────────────────────────────────
const arg = process.argv[2] ?? '전체'
const targets = arg === '경제' ? ['경제']
              : arg === '사회' ? ['사회']
              : ['경제', '사회', '정치', 'IT']

const results = {}
for (const cat of targets) {
  try {
    results[cat] = await fetchCategory(cat)
  } catch (err) {
    process.stderr.write(`${err.message}\n`)
    results[cat] = []
  }
}

// Merge all items, deduplicate by title, sort by pubDate desc
const allItems = Object.values(results).flat()
const seen = new Set()
const unique = allItems
  .filter(item => {
    if (seen.has(item.title)) return false
    seen.add(item.title)
    return true
  })
  .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))

process.stdout.write(JSON.stringify({ categories: results, all: unique }, null, 2) + '\n')
