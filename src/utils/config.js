import '@/utils/global'

if (process.env.NODE_ENV === 'production') {
  window.basename = process.env.PUBLIC_URL.slice(0, -1)
} else {
  window.basename = ''
}
