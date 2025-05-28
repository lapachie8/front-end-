import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { jsPDF } from 'npm:jspdf@2.5.1';
import { utils, write } from 'npm:xlsx@0.18.5';

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
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Verify admin authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify admin role
    const { data: adminProfile } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!adminProfile) {
      throw new Error('Unauthorized');
    }

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    const format = url.searchParams.get('format') || 'json';

    let reportData;
    switch (path) {
      case 'daily': {
        const { data, error } = await supabase
          .rpc('get_daily_report');
        if (error) throw error;
        reportData = data;
        break;
      }

      case 'monthly': {
        const { data, error } = await supabase
          .rpc('get_monthly_report');
        if (error) throw error;
        reportData = data;
        break;
      }

      case 'annual': {
        const { data, error } = await supabase
          .rpc('get_annual_report');
        if (error) throw error;
        reportData = data;
        break;
      }

      default:
        throw new Error('Invalid endpoint');
    }

    // Format response based on requested format
    switch (format) {
      case 'pdf': {
        const doc = new jsPDF();
        doc.text('Financial Report', 10, 10);
        // Add report data to PDF
        let y = 30;
        reportData.forEach((row: any) => {
          doc.text(JSON.stringify(row), 10, y);
          y += 10;
        });
        const pdfOutput = doc.output('arraybuffer');
        
        return new Response(
          pdfOutput,
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename="report.pdf"',
            },
          }
        );
      }

      case 'excel': {
        const wb = utils.book_new();
        const ws = utils.json_to_sheet(reportData);
        utils.book_append_sheet(wb, ws, 'Report');
        const excelOutput = write(wb, { type: 'array' });
        
        return new Response(
          excelOutput,
          {
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Content-Disposition': 'attachment; filename="report.xlsx"',
            },
          }
        );
      }

      default:
        return new Response(
          JSON.stringify(reportData),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
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