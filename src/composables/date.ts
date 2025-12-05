export function useTimeAgo() {
  const timeAgo = (dateString: string) => {
    const input = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - input.getTime()

    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour

    if (diff < minute) return 'just now'
    if (diff < hour) return `${Math.floor(diff / minute)} mins ago`
    if (diff < day) return `${Math.floor(diff / hour)} hours ago`

    const days = Math.floor(diff / day)
    return days === 1 ? '1 day ago' : `${days} days ago`
  }

  return { timeAgo }
}
