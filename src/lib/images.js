export const formatSize = bytes => bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`
export async function readImage(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Please choose a JPG, PNG, or WebP image.')
  if (file.size > 30 * 1024 * 1024) throw new Error('This image is too large. Please choose a file under 30 MB.')
  const url = URL.createObjectURL(file)
  const image = new Image()
  image.src = url
  try { await image.decode() } catch { URL.revokeObjectURL(url); throw new Error('We couldn’t read this image. Please try another file.') }
  if (image.naturalWidth * image.naturalHeight > 80000000) { URL.revokeObjectURL(url); throw new Error('This image has too many pixels. Please choose a smaller image.') }
  return { file, url, image, width: image.naturalWidth, height: image.naturalHeight }
}
export async function processImage(source, { width, height, format, quality }) {
  if (!Number.isInteger(+width) || !Number.isInteger(+height) || width < 1 || height < 1 || width > 8192 || height > 8192 || width * height > 40000000) throw new Error('Use dimensions from 1 to 8,192 pixels, up to 40 megapixels total.')
  const canvas = document.createElement('canvas')
  canvas.width = +width; canvas.height = +height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Your browser could not create an image. Please try a smaller size.')
  if (format === 'jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, +width, +height) }
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(source.image, 0, 0, +width, +height)
  const blob = await new Promise(resolve => canvas.toBlob(resolve, `image/${format}`, quality / 100))
  if (!blob || blob.type !== `image/${format}`) throw new Error('Your browser doesn’t support this output format. Please choose another format.')
  return { blob, url: URL.createObjectURL(blob), width, height, name: `${source.file.name.replace(/\.[^.]+$/, '')}-compressed.${format === 'jpeg' ? 'jpg' : format}` }
}
