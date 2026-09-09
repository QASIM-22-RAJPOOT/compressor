import Icon from './Icon'
export default function Settings({ settings, setSettings, source, busy, onCompress }) {
  const update = (key, value) => setSettings(s => ({ ...s, [key]: value }))
  function dimension(key, value) {
    setSettings(s => {
      const next = { ...s, [key]: value }
      if (s.locked && source && value) next[key === 'width' ? 'height' : 'width'] = Math.max(1, Math.round(+value * (key === 'width' ? source.height / source.width : source.width / source.height)))
      return next
    })
  }
  return <aside className="settings card"><div className="card-heading"><Icon name="sliders"/><h2>Compression settings</h2></div><fieldset disabled={busy}>
    <div className="flex items-center justify-between mb-4"><label htmlFor="quality">Image quality</label><span className="quality-value">{settings.quality}%</span></div>
    <input id="quality" type="range" min="10" max="100" value={settings.quality} onChange={e => update('quality', +e.target.value)} disabled={settings.format === 'png'} style={{ '--range': `${(settings.quality - 10) / .9}%` }}/>
    <div className="range-labels"><span>Smaller file</span><span>Better quality</span></div>
    <p className="settings-hint">{settings.format === 'png' ? 'PNG is lossless. Resize to reduce its file size.' : '80% is the sweet spot for most images.'}</p>
    <div className="divider"/><label>Resize image <span className="optional">(optional)</span></label>
    <div className="dimensions"><div><label htmlFor="width">Width</label><div className="number-field"><input id="width" type="number" min="1" max="8192" placeholder="Original" value={settings.width} onChange={e => dimension('width', e.target.value)}/><span>px</span></div></div><Icon name="link" size={17}/><div><label htmlFor="height">Height</label><div className="number-field"><input id="height" type="number" min="1" max="8192" placeholder="Original" value={settings.height} onChange={e => dimension('height', e.target.value)}/><span>px</span></div></div></div>
    <label className="checkbox-label"><input type="checkbox" checked={settings.locked} onChange={e => { const locked = e.target.checked; setSettings(s => ({ ...s, locked, ...(locked && source && s.width ? { height: Math.max(1, Math.round(+s.width * source.height / source.width)) } : {}) })) }}/><span>Maintain aspect ratio</span><Icon name="lock" size={13}/></label>
    <div className="divider"/><label>Output format</label><div className="format-buttons" role="group" aria-label="Output format">{[['jpeg','JPG'],['png','PNG'],['webp','WebP']].map(([value,label]) => <button key={value} className={settings.format === value ? 'selected' : ''} aria-pressed={settings.format === value} onClick={() => update('format',value)}>{label}{settings.format === value && <Icon name="check" size={14}/>}</button>)}</div>
    <p className="settings-hint">{settings.format === 'jpeg' ? 'Great for photos. Transparent areas become white.' : settings.format === 'png' ? 'Best for graphics and transparent images.' : 'Smaller images, made for the modern web.'}</p>
    <button className="primary compress-button" disabled={!source || busy} onClick={onCompress}><Icon name={busy ? 'sliders' : 'sparkle'} size={18}/>{busy ? 'Processing image…' : 'Compress Image'}{!busy && <Icon name="arrow" size={17}/>}</button>
    <p className="local-note"><Icon name="shield" size={13}/>Processed locally. Always private.</p>
  </fieldset></aside>
}
