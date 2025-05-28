import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

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

    switch (path) {
      case 'list': {
        const { data, error } = await supabase
          .from('rentals')
          .select(`
            *,
            profiles (
              full_name,
              email,
              phone
            ),
            rental_items (
              *,
              products (
                name,
                price
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        return new Response(
          JSON.stringify(data),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'update-status': {
        const { orderId, status } = await req.json();
        
        const { data, error } = await supabase
          .from('rentals')
          .update({ status })
          .eq('id', orderId)
          .select()
          .single();

        if (error) throw error;

        // Log the action
        await supabase.from('admin_audit_logs').insert({
          admin_id: user.id,
          action: 'update_status',
          entity_type: 'rental',
          entity_id: orderId,
          details: { status },
        });

        // Queue status update email
        await supabase.from('email_queue').insert({
          template_id: (await supabase
            .from('email_templates')
            .select('id')
            .eq('name', 'order_status_update')
            .single()
          ).data?.id,
          recipient: data.email,
          data: {
            order_id: orderId,
            status,
          },
        });

        return new Response(
          JSON.stringify(data),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'statistics': {
        const { data: stats, error } = await supabase
          .rpc('get_rental_statistics');

        if (error) throw error;

        return new Response(
          JSON.stringify(stats),
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