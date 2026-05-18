'use client';

import { useState, useEffect } from 'react';
import { ICONS } from '@/data/icons';
import { OrbitIcon } from './orbit-icon';

interface RequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function RequestModal({ open, onClose, onSubmitted }: RequestModalProps) {
  const [form, setForm] = useState({
    name: '',
    category: 'Arrows',
    description: '',
    use_case: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) setDone(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 700));
    setSubmitting(false);
    setDone(true);
    onSubmitted?.();
    setTimeout(() => {
      onClose();
      setForm({ name: '', category: 'Arrows', description: '', use_case: '', email: '' });
    }, 1200);
  };

  const cats = Array.from(new Set(ICONS.map(i => i.category)));

  return (
    <div className={`modal-overlay ${open ? 'open' : ''}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>{done ? <>Request <em>received</em>.</> : <>Request an <em>icon</em>.</>}</h3>
            <div className="sub">
              {done
                ? "We'll review it and ship in the next release."
                : 'Suggest a mark we should add to the set. We triage weekly.'}
            </div>
          </div>
          <button className="sheet-close" onClick={onClose} aria-label="Close">
            <OrbitIcon name="x" size={18} />
          </button>
        </div>

        {done ? (
          <div style={{ padding: '24px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--accent-soft)', color: 'var(--accent)',
              display: 'grid', placeItems: 'center',
            }}>
              <OrbitIcon name="check" size={28} strokeWidth={2} />
            </div>
            <div style={{ fontSize: 14, color: 'var(--fg-2)' }}>
              Thanks — tracked as <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--accent)' }}>
                #REQ-{Math.floor(Math.random() * 9000 + 1000)}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="modal-body">
              <div className="field">
                <label htmlFor="req-name">Icon name</label>
                <input id="req-name" type="text" placeholder="e.g. waveform, dna, sparkle-trail"
                  value={form.name} onChange={(e) => update('name', e.target.value)} required />
                <span className="hint">Lowercase kebab-case, matches our naming convention.</span>
              </div>
              <div className="field">
                <label htmlFor="req-cat">Category</label>
                <select id="req-cat" value={form.category} onChange={(e) => update('category', e.target.value)}>
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="__new__">+ New category…</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="req-desc">Description</label>
                <textarea id="req-desc" rows={3} placeholder="What the icon represents and what visual elements it should have."
                  value={form.description} onChange={(e) => update('description', e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="req-use">Use case <span style={{ textTransform: 'none', color: 'var(--fg-3)' }}>(optional)</span></label>
                <input id="req-use" type="text" placeholder="Where in your product would this appear?"
                  value={form.use_case} onChange={(e) => update('use_case', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="req-email">Email <span style={{ textTransform: 'none', color: 'var(--fg-3)' }}>(optional, for follow-up)</span></label>
                <input id="req-email" type="email" placeholder="you@team.com"
                  value={form.email} onChange={(e) => update('email', e.target.value)} />
              </div>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
