'use client';

import { useEffect, useState } from 'react';

type BxAuth = {
  domain?: string;   // e.g., b24-xxxx.bitrix24.com.br
  member_id?: string;
  user_id?: string | number;
};

export default function Page() {
  const [auth, setAuth] = useState<BxAuth>({});
  const [mobile, setMobile] = useState('');
  const [configKey, setConfigKey] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    // Grab Bitrix context if embedded in Bitrix
    try {
      // @ts-ignore
      if (typeof BX24 !== 'undefined') {
        // @ts-ignore
        BX24.init(() => {
          try {
            // @ts-ignore
            const a = BX24.getAuth() || {};
            // @ts-ignore
            const site: string = BX24.getSite?.() || '';
            const domain = site.replace(/^https?:\/\//, '').replace(/\/$/, '');

            setAuth({
              domain: domain || 'unknown',
              member_id: a.member_id,
              user_id: a.user_id,
            });
          } catch (e) {
            console.warn('BX24 context error', e);
          }
        });
      } else {
        // local test fallback
        setAuth({ domain: 'local-test', member_id: 'dev', user_id: 'dev' });
      }
    } catch {}
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Saving...');

    const res = await fetch('/api/save-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        portalDomain: auth.domain,
        memberId: auth.member_id,
        userId: auth.user_id,
        mobile,
        configKey,
      }),
    });

    const data = await res.json();
    setStatus(res.ok ? 'Saved!' : `Error: ${data?.error || 'unknown error'}`);
  }

  return (
    <main style={{ maxWidth: 560, margin: '48px auto', padding: '0 16px' }}>
      <h2 style={{ margin: '0 0 8px' }}>Configuration</h2>
      <p style={{ color: '#666', marginTop: 0 }}>
        Portal: <b>{auth.domain || '(detecting...)'}</b>
      </p>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          Mobile number
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="+55 11 99999-9999"
            required
            inputMode="tel"
            style={{ padding: 10, border: '1px solid #ddd', borderRadius: 10 }}
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          Configuration key
          <input
            value={configKey}
            onChange={(e) => setConfigKey(e.target.value)}
            placeholder="your-config-key"
            required
            style={{ padding: 10, border: '1px solid #ddd', borderRadius: 10 }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: '12px 14px',
            borderRadius: 10,
            border: 'none',
            background: '#111',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Save
        </button>
      </form>

      {status && <p style={{ marginTop: 12 }}>{status}</p>}

      <div style={{ marginTop: 24, fontSize: 12, color: '#888' }}>
        <div>member_id: {String(auth.member_id || '')}</div>
        <div>user_id: {String(auth.user_id || '')}</div>
      </div>
    </main>
  );
}