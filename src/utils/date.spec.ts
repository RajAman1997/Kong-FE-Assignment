import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTimeAgo } from '@/utils/date'

describe('useTimeAgo', () => {
  const fixedNow = new Date('2024-01-10T12:00:00Z')

  beforeEach(() => {
    // Freeze time
    vi.useFakeTimers()
    vi.setSystemTime(fixedNow)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "just now" for less than 1 minute ago', () => {
    const { timeAgo } = useTimeAgo()

    const date = new Date(fixedNow.getTime() - 30 * 1000).toISOString()

    expect(timeAgo(date)).toBe('just now')
  })

  it('returns minutes ago for less than 1 hour', () => {
    const { timeAgo } = useTimeAgo()

    const date = new Date(fixedNow.getTime() - 5 * 60 * 1000).toISOString()

    expect(timeAgo(date)).toBe('5 mins ago')
  })

  it('returns hours ago for less than 1 day', () => {
    const { timeAgo } = useTimeAgo()

    const date = new Date(fixedNow.getTime() - 3 * 60 * 60 * 1000).toISOString()

    expect(timeAgo(date)).toBe('3 hours ago')
  })

  it('returns "1 day ago" for exactly one day', () => {
    const { timeAgo } = useTimeAgo()

    const date = new Date(fixedNow.getTime() - 24 * 60 * 60 * 1000).toISOString()

    expect(timeAgo(date)).toBe('1 day ago')
  })

  it('returns days ago for more than one day', () => {
    const { timeAgo } = useTimeAgo()

    const date = new Date(fixedNow.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()

    expect(timeAgo(date)).toBe('5 days ago')
  })
})
