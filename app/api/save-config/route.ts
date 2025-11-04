import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const portalDomain = String(body?.portalDomain || '').trim();
    const memberId = body?.memberId ? String(body.memberId) : null;
    const userId = body?.userId ? String(body.userId) : null;
    const mobile = String(body?.mobile || '').trim();
    const configKey = String(body?.configKey || '').trim();

    if (!portalDomain) {
      return NextResponse.json({ error: 'Missing portalDomain' }, { status: 400 });
    }
    if (!mobile || !configKey) {
      return NextResponse.json({ error: 'Missing mobile or configKey' }, { status: 400 });
    }

    // normalize mobile but keep leading '+'
    const normalizedMobile = mobile.replace(/[^\d+]/g, '');

    const result = await sql/*sql*/`
      INSERT INTO tenant_config (portal_domain, member_id, user_id, mobile, config_key)
      VALUES (${portalDomain}, ${memberId}, ${userId}, ${normalizedMobile}, ${configKey})
      ON CONFLICT (portal_domain)
      DO UPDATE SET
        member_id = EXCLUDED.member_id,
        user_id   = EXCLUDED.user_id,
        mobile    = EXCLUDED.mobile,
        config_key= EXCLUDED.config_key,
        updated_at= NOW()
      RETURNING id, portal_domain, mobile, config_key, updated_at;
    `;

    return NextResponse.json({ ok: true, data: result.rows[0] });
  } catch (err: any) {
    console.error('save-config error', err);
    return NextResponse.json(
      { error: err?.message || 'Unexpected error' },
      { status: 500 }
    );
  }
}