export function truncate_text(text, limit) {
  return text.slice(0, limit) + (text.length > limit ? '...' : '')
}