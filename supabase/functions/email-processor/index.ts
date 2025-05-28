import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { SMTPClient } from 'npm:emailjs@4.0.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const smtp = new SMTPClient({
  user: Deno.env.get('SMTP_USER'),
  password: Deno.env.get('SMTP_PASSWORD'),
  host: Deno.env.get('SMTP_HOST'),
  port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
  tls: true,
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get pending emails
    const { data: emails, error: emailsError } = await supabase
      .from('email_queue')
      .select(`
        *,
        email_templates (
          subject,
          content
        )
      `)
      .eq('status', 'pending')
      .limit(10);

    if (emailsError) throw emailsError;

    for (const email of emails) {
      try {
        // Update status to processing
        await supabase
          .from('email_queue')
          .update({ status: 'processing' })
          .eq('id', email.id);

        // Replace template variables
        let subject = email.email_templates.subject;
        let content = email.email_templates.content;
        
        Object.entries(email.data).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          subject = subject.replace(regex, String(value));
          content = content.replace(regex, String(value));
        });

        // Send email
        await smtp.send({
          from: Deno.env.get('SMTP_FROM'),
          to: email.recipient,
          subject,
          text: content,
        });

        // Update status to sent
        await supabase
          .from('email_queue')
          .update({
            status: 'sent',
            updated_at: new Date().toISOString(),
          })
          .eq('id', email.id);
      } catch (error) {
        // Update status to failed
        await supabase
          .from('email_queue')
          .update({
            status: 'failed',
            error: error.message,
            attempts: email.attempts + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', email.id);
      }
    }

    return new Response(
      JSON.stringify({ processed: emails.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
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