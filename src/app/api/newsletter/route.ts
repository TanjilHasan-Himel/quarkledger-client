import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { z } from 'zod';

const SubscribeSchema = z.object({
  email: z.string().email({ message: 'সঠিক ইমেইল এড্রেস লিখুন' }),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting: Max 5 subscription requests per 10 minutes per IP
    const clientIp = getClientIp(req);
    const rateCheck = checkRateLimit(`newsletter:${clientIp}`, { intervalMs: 10 * 60_000, maxRequests: 5 });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'অতিরিক্ত অনুরোধ করা হয়েছে। কিছুক্ষণ পর পুনরায় চেষ্টা করুন।' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateCheck.resetTimeMs / 1000).toString(),
          },
        }
      );
    }
    const body = await req.json();
    const result = SubscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues?.[0]?.message || 'ভুল ইমেইল ফরমেট' },
        { status: 400 }
      );
    }

    const email = result.data.email.toLowerCase().trim();
    const supabase = await createServerClient();

    // 1. Try insert into subscribers table
    const { error } = await supabase.from('subscribers').insert({ email });

    if (error) {
      // If table doesn't exist yet, fall back to storing in tags table
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        const hash = Buffer.from(email).toString('hex').slice(0, 16);
        await supabase.from('tags').insert({
          publication_id: 'a0000000-0000-0000-0000-000000000001',
          name: `sub:${email}`,
          slug: `sub-${hash}`,
        });
      } else if (error.code === '23505' || error.message?.includes('duplicate key')) {
        return NextResponse.json({
          success: true,
          message: 'আপনি ইতিমধ্যে আমাদের ডিসপ্যাচে সাবস্ক্রাইব করে আছেন!',
        });
      } else {
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'অভিনন্দন! সাপ্তাহিক কোয়ার্ক লেজার ডিসপ্যাচে আপনার সাবস্ক্রিপশন সম্পন্ন হয়েছে।',
    });

  } catch (err: any) {
    console.error('[Newsletter Error]:', err);
    return NextResponse.json({ error: 'সাবস্ক্রাইব করতে সাময়িক সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।' }, { status: 500 });
  }
}
