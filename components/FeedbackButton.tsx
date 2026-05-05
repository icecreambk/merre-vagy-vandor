'use client'

import { useState } from 'react'

export default function FeedbackButton({ source }: { source: 'landing' | 'terkep' }) {
  const [open, setOpen] = useState(false)
  const [opinion, setOpinion] = useState('')
  const [device, setDevice] = useState('')
  const [improvement, setImprovement] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opinion, device, improvement, source }),
      })
      setSent(true)
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => { setSent(false); setOpinion(''); setDevice(''); setImprovement('') }, 300)
  }

  return (
    <>
      <style>{`
        .fb-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          background: rgba(232,197,71,0.15);
          border: 1px solid rgba(232,197,71,0.4);
          color: rgba(232,197,71,0.9);
          border-radius: 24px;
          padding: 10px 18px;
          font-size: 13px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: background 0.2s;
          font-family: Georgia, serif;
        }
        .fb-btn:hover { background: rgba(232,197,71,0.25); }
        .fb-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .fb-modal {
          background: #0d0d1f;
          border: 1px solid rgba(232,197,71,0.25);
          border-radius: 16px;
          padding: 28px 24px;
          width: 100%; max-width: 420px;
          font-family: Georgia, serif;
        }
        .fb-title {
          font-size: 18px; color: #e8c547;
          margin-bottom: 20px; font-weight: normal;
        }
        .fb-label {
          font-size: 13px; color: rgba(255,255,255,0.6);
          margin-bottom: 6px; display: block;
        }
        .fb-textarea {
          width: 100%; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(232,197,71,0.2);
          border-radius: 8px; color: #fff;
          font-family: Georgia, serif; font-size: 14px;
          padding: 10px 12px; resize: vertical;
          min-height: 72px; margin-bottom: 16px;
          box-sizing: border-box;
        }
        .fb-textarea:focus { outline: none; border-color: rgba(232,197,71,0.5); }
        .fb-device-group {
          display: flex; gap: 8px; margin-bottom: 16px;
        }
        .fb-device-btn {
          flex: 1; padding: 8px 4px;
          border-radius: 8px; font-size: 13px;
          cursor: pointer; font-family: Georgia, serif;
          border: 1px solid rgba(232,197,71,0.2);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.6);
          transition: all 0.15s;
        }
        .fb-device-btn.active {
          background: rgba(232,197,71,0.18);
          border-color: rgba(232,197,71,0.6);
          color: #e8c547;
        }
        .fb-submit {
          width: 100%; padding: 12px;
          background: #e8c547; color: #060612;
          border: none; border-radius: 10px;
          font-size: 15px; font-weight: bold;
          cursor: pointer; font-family: Georgia, serif;
          margin-top: 4px;
        }
        .fb-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .fb-close {
          position: absolute; top: 16px; right: 16px;
          background: none; border: none;
          color: rgba(255,255,255,0.4); font-size: 20px;
          cursor: pointer; line-height: 1;
        }
        .fb-thank {
          text-align: center; padding: 20px 0;
          color: rgba(255,255,255,0.8); font-size: 15px;
        }
        .fb-thank .fb-check { font-size: 40px; margin-bottom: 12px; }
      `}</style>

      <button className="fb-btn" onClick={() => setOpen(true)}>
        💬 Visszajelzés
      </button>

      {open && (
        <div className="fb-backdrop" onClick={handleClose}>
          <div className="fb-modal" style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button className="fb-close" onClick={handleClose}>×</button>

            {sent ? (
              <div className="fb-thank">
                <div className="fb-check">✅</div>
                Köszönjük a visszajelzést!
                <br /><br />
                <button className="fb-submit" onClick={handleClose}>Bezárás</button>
              </div>
            ) : (
              <>
                <div className="fb-title">💬 Mit gondolsz?</div>

                <label className="fb-label">1. Mit gondolsz az oldalról?</label>
                <textarea
                  className="fb-textarea"
                  placeholder="Írd le benyomásaidat..."
                  value={opinion}
                  onChange={e => setOpinion(e.target.value)}
                />

                <label className="fb-label">2. Milyen eszközön nézel?</label>
                <div className="fb-device-group">
                  {['telefon', 'tablet', 'pc'].map(d => (
                    <button
                      key={d}
                      className={`fb-device-btn${device === d ? ' active' : ''}`}
                      onClick={() => setDevice(d)}
                    >
                      {d === 'telefon' ? '📱 Telefon' : d === 'tablet' ? '📟 Tablet' : '💻 PC'}
                    </button>
                  ))}
                </div>

                <label className="fb-label">3. Mit kellene javítani?</label>
                <textarea
                  className="fb-textarea"
                  placeholder="Bármit szívesen meghallgatunk..."
                  value={improvement}
                  onChange={e => setImprovement(e.target.value)}
                />

                <button
                  className="fb-submit"
                  onClick={handleSubmit}
                  disabled={loading || (!opinion && !improvement)}
                >
                  {loading ? 'Küldés...' : 'Elküldöm'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
