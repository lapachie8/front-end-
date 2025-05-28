import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { totp } from 'npm:otplib@12.0.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('https://jwknsrbgpxogbaebmuyo.supabase.co') ?? '',
      Deno.env.get('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3a25zcmJncHhvZ2JhZWJtdXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzOTY5OTMsImV4cCI6MjA2Mzk3Mjk5M30.GPgVV5ybScAKjrjjuOCHrig3SQ_37VzaN-3P7xl3cAY') ?? ''
    );

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    switch (path) {
      case 'verify-2fa': {
        const { code, session } = await req.json();
        const { data: profile } = await supabase
          .from('admin_profiles')
          .select('two_factor_secret')
          .eq('id', session.user.id)
          .single();

        if (!profile?.two_factor_secret) {
          throw new Error('2FA not set up');
        }

        const isValid = totp.verify({
          token: code,
          secret: profile.two_factor_secret,
        });

        if (!isValid) {
          throw new Error('Invalid 2FA code');
        }

        // Update last login and reset login attempts
        await supabase
          .from('admin_profiles')
          .update({
            last_login: new Date().toISOString(),
            login_attempts: 0,
          })
          .eq('id', session.user.id);

        return new Response(
          JSON.stringify({ success: true }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'setup-2fa': {
        const { session } = await req.json();
        const secret = totp.generateSecret();

        await supabase
          .from('admin_profiles')
          .update({
            two_factor_secret: secret,
            two_factor_enabled: true,
          })
          .eq('id', session.user.id);

        return new Response(
          JSON.stringify({ secret }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      default:
        throw new Error('Invalid endpoint');
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});