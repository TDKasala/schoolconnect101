import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { mkdirSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const publicDir = join(__dirname, '..', 'public')
const source = join(publicDir, 'logo.png')

console.log('🎨 Generating real PNG PWA icons from public/logo.png...')

function out(name) {
  return join(publicDir, name)
}

async function ensurePublic() {
  if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true })
}

async function makeIcon(size, filename) {
  await sharp(source)
    .resize(size, size, { fit: 'cover' })
    .png({ quality: 90 })
    .toFile(out(filename))
  console.log(`✅ Created ${filename} (${size}x${size})`)
}

// For maskable, add safe padding so important content isn't clipped
async function makeMaskable(size, filename) {
  const pad = Math.round(size * 0.1) // 10% safe zone
  const canvas = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    },
  })

  const resized = await sharp(source)
    .resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer()

  await sharp(await canvas.png().toBuffer())
    .composite([{ input: resized, left: pad, top: pad }])
    .png({ quality: 90 })
    .toFile(out(filename))
  console.log(`✅ Created ${filename} (${size}x${size}, maskable)`) 
}

;(async () => {
  await ensurePublic()
  // Standard icons
  await makeIcon(192, 'logo-192.png')
  await makeIcon(512, 'logo-512.png')
  // Maskable variants
  await makeMaskable(192, 'logo-192-maskable.png')
  await makeMaskable(512, 'logo-512-maskable.png')
  console.log('🎉 PWA icons generated successfully!')
})().catch((err) => {
  console.error('❌ Failed to generate icons:', err)
  process.exit(1)
})
