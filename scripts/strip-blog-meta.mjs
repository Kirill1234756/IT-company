import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const files = [
  path.join(__dirname, '../src/stores/blog.data.ts'),
  path.join(__dirname, '../../seo/blog_posts_to_add.ts'),
]
const strip = (p) => {
  let s = fs.readFileSync(p, 'utf8')
  s = s.replace(/\r?\n\s*readTime:\s*'[^']*',?/g, '')
  s = s.replace(/\r?\n\s*author:\s*'[^']*',?/g, '')
  s = s.replace(/\r?\n\s*views:\s*\d+,?/g, '')
  s = s.replace(/\r?\n\s*date:\s*'[^']*',?/g, '')
  fs.writeFileSync(p, s)
  console.log('stripped', p)
}
for (const p of files) {
  if (fs.existsSync(p)) strip(p)
}
