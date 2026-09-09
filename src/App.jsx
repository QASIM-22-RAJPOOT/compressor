import { useEffect, useRef, useState } from 'react'
import Icon from './components/Icon'
import Settings from './components/Settings'
import Comparison from './components/Comparison'
import { formatSize, processImage, readImage } from './lib/images'

const defaults = { quality: 80, width: '', height: '', locked: true, format: 'webp' }
const faqs = [
  ['Will compressing an image reduce its quality?', 'JPG and WebP use lossy compression, so some detail can change. A quality setting of 80% is a good starting point for balancing appearance and size. Use the before-and-after slider to inspect your result. PNG keeps image detail lossless unless you resize it.'],
  ['Are my images safe and private?', 'Absolutely. Your images are processed entirely in your browser using your device. They are never uploaded, stored on a server, or shared with anyone.'],
  ['Which image formats can I compress or convert?', 'Upload JPG, JPEG, PNG, or WebP files up to 30 MB and export as JPG, PNG, or WebP. JPG uses a white background for transparent images. PNG and WebP support transparency.'],
  ['Is this tool really free to use?', 'Yes. There are no subscriptions, accounts, watermarks, or usage limits. Compress and convert as many images as you like.'],
  ['Why is my compressed image sometimes larger?', 'An already optimized image may become larger when encoded again, especially when converting to PNG or increasing dimensions. Try WebP, lower the quality, or reduce the width and height.'],
]
export default function App() {
  const [source, setSource] = useState(null)
  const [result, setResult] = useState(null)
  const [settings, setSettings] = useState(defaults)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)
  const operation = useRef(0)
  useEffect(() => () => { if (source) URL.revokeObjectURL(source.url) }, [source])
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url) }, [result])
  async function selectFile(file) {
    if (!file || busy) return
    const id = ++operation.current
    setError(''); setBusy(true)
    try {
      const next = await readImage(file)
      if (id !== operation.current) { URL.revokeObjectURL(next.url); return }
      setSource(next); setResult(null); setSettings(s => ({ ...s, width: next.width, height: next.height }))
    } catch (e) { setError(e.message) } finally { if (id === operation.current) setBusy(false) }
  }
  function reset() { operation.current++; setSource(null); setResult(null); setSettings(defaults); setError(''); setBusy(false); if (inputRef.current) inputRef.current.value = '' }
  async function compress() {
    if (!source || busy) return
    setBusy(true); setError(''); setResult(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 120))
      setResult(await processImage(source, settings))
    } catch (e) { setError(e.message || 'Something went wrong. Please try another image.') } finally { setBusy(false) }
  }
  return <div className="app"><header className="site-header"><a href="#" className="brand"><span className="brand-icon"><Icon name="sparkle" size={23}/></span>pixel<span className="brand-light">press</span><span className="ai-badge">AI</span></a><nav aria-label="Main navigation"><a className="active" href="#compressor">Image compressor</a><a href="#how-it-works">How it works</a><a href="#faq">FAQs</a></nav><span className="header-note"><span/>100% free. No sign-up.</span></header>
  <main><section className="hero"><div className="eyebrow"><Icon name="sparkle" size={14}/>LESS WEIGHT. SAME WOW.</div><h1>Compress Images<br/>Without Losing <span>Quality<svg viewBox="0 0 290 16" aria-hidden="true"><path d="M3 11Q130-3 286 8M35 15Q167 5 260 12"/></svg></span><span className="heading-dot">.</span></h1><p>Smaller files. Stunning visuals. Compress, resize, and convert<br className="desktop-break"/> your images in seconds — right in your browser.</p><div className="hero-perks"><span><Icon name="shield" size={16}/>Private by design</span><i/><span><Icon name="bolt" size={16}/>Lightning fast</span><i/><span><Icon name="check" size={16}/>No limits, no cost</span></div></section>
  <section id="compressor" className="workspace"><div className="upload-column"><div className="card upload-card"><div className="card-heading"><span className="step-number">01</span><h2>Start with your image</h2><span className="small-label">A little lighter starts here</span></div><input ref={inputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Select image file" disabled={busy} onChange={e => { selectFile(e.target.files[0]); e.target.value = '' }}/><div className={`dropzone ${dragging ? 'dragging' : ''} ${source ? 'has-image' : ''}`} onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length > 1) setError('Please select one image at a time.'); else selectFile(e.dataTransfer.files[0]) }}>
  {source ? <><div className="source-preview"><img src={source.url} alt={`Original: ${source.file.name}`}/></div><div className="file-info"><div><strong title={source.file.name}>{source.file.name}</strong><span>{formatSize(source.file.size)} <b>·</b> {source.width} × {source.height} px</span></div><button className="icon-button" onClick={reset} disabled={busy} aria-label="Remove and reset image"><Icon name="close" size={18}/></button></div><button className="replace-button" disabled={busy} onClick={() => inputRef.current.click()}>Choose a different image</button></> : <><div className="upload-art"><div className="art-back"/><div className="art-front"><Icon name="image" size={35}/></div><span className="art-spark">✦</span><span className="art-upload"><Icon name="upload" size={15}/></span></div><h3>Drop your image here</h3><p>or choose a file from your device</p><button className="primary select-button" disabled={busy} onClick={() => inputRef.current.click()}><Icon name="upload" size={17}/>{busy ? 'Reading image…' : 'Select Image'}</button><div className="file-types"><span>JPG</span><span>PNG</span><span>WebP</span><i>Up to 30 MB</i></div></>}
  </div><div className="privacy-strip"><Icon name="lock" size={14}/><span>Your images stay yours. Files never leave your device.</span><Icon name="shield" size={16}/></div></div>{error && <div className="error-message" role="alert"><span>{error}</span><button aria-label="Dismiss error" onClick={() => setError('')}><Icon name="close" size={16}/></button></div>}<div className="little-tip"><span className="tip-icon"><Icon name="bolt" size={17}/></span><p><strong>A small change. A big impact.</strong> Lighter images mean faster websites,<br className="desktop-break"/> happier visitors, and a little less internet energy.</p></div></div><Settings settings={settings} setSettings={setSettings} source={source} busy={busy} onCompress={compress}/></section>
  <Comparison source={source} result={result} busy={busy}/>
  <section id="how-it-works" className="how-section"><div className="section-kicker">SIMPLE BY DESIGN</div><h2>Three steps. A lighter image.</h2><p>No complicated software. No learning curve. Just better-sized images.</p><div className="steps">{[['01','upload','Drop it in','Pick your JPG, PNG, or WebP. We’ll take it from there.'],['02','sliders','Make it yours','Fine-tune the quality, resize, and choose your format.'],['03','download','Lighten the load','Compare the result and download your freshly optimized image.']].map(([n,icon,title,description]) => <article key={n}><span className="step-icon"><Icon name={icon} size={23}/></span><span className="step-index">{n}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
  <section id="faq" className="faq-section"><div><div className="section-kicker">GOOD QUESTIONS</div><h2>A little clarity.</h2><p>Everything you might be wondering<br/>before you press compress.</p><div className="faq-decoration"><Icon name="sparkle" size={36}/><span>Less size.<br/>More possibilities.</span></div></div><div className="faq-list">{faqs.map(([q,a]) => <details key={q}><summary>{q}<Icon name="chevron" size={17}/></summary><p>{a}</p></details>)}</div></section>
  <section className="privacy-banner"><span className="privacy-icon"><Icon name="shield" size={25}/></span><div><h3>On your device. Off our servers.</h3><p>No uploads. No tracking. Just you and your images.</p></div><span className="privacy-pill"><span/>100% browser-based</span></section></main><footer><a href="#" className="brand"><span className="brand-icon"><Icon name="sparkle" size={18}/></span>pixel<span className="brand-light">press</span></a><span>Small files. Big possibilities.</span><p>© {new Date().getFullYear()} Pixelpress. Made for a lighter web.</p></footer></div>
}
