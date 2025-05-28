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
    const productId = url.searchParams.get('id');

    switch (req.method) {
      case 'POST': {
        const { name, description, price, category, imageUrl } = await req.json();
        
        const { data, error } = await supabase
          .from('products')
          .insert({
            name,
            description,
            price,
            category,
            image_url: imageUrl,
          })
          .select()
          .single();

        if (error) throw error;

        // Log the action
        await supabase.from('admin_audit_logs').insert({
          admin_id: user.id,
          action: 'create',
          entity_type: 'product',
          entity_id: data.id,
          details: data,
        });

        return new Response(
          JSON.stringify(data),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'PUT': {
        if (!productId) throw new Error('Missing product ID');

        const updates = await req.json();
        
        const { data, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', productId)
          .select()
          .single();

        if (error) throw error;

        // Log the action
        await supabase.from('admin_audit_logs').insert({
          admin_id: user.id,
          action: 'update',
          entity_type: 'product',
          entity_id: productId,
          details: updates,
        });

        return new Response(
          JSON.stringify(data),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'DELETE': {
        if (!productId) throw new Error('Missing product ID');

        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (error) throw error;

        // Log the action
        await supabase.from('admin_audit_logs').insert({
          admin_id: user.id,
          action: 'delete',
          entity_type: 'product',
          entity_id: productId,
        });

        return new Response(
          JSON.stringify({ success: true }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      default:
        throw new Error('Method not allowed');
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