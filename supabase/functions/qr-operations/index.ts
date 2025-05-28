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

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    switch (path) {
      case 'scan': {
        const { qrCode, action, returnDate } = await req.json();
        
        // Get item instance
        const { data: item, error: itemError } = await supabase
          .from('item_instances')
          .select(`
            *,
            products (
              name,
              description
            )
          `)
          .eq('qr_code', qrCode)
          .single();

        if (itemError) throw itemError;
        if (!item) throw new Error('Item not found');

        // Update item status
        const newStatus = action === 'check_out' ? 'rented' : 
                         action === 'check_in' ? 'available' : 
                         action === 'maintenance' ? 'maintenance' : 
                         item.status;

        const { data: updatedItem, error: updateError } = await supabase
          .rpc('update_item_status', {
            item_id: item.id,
            new_status: newStatus,
            scan_type: action,
            return_date: returnDate
          });

        if (updateError) throw updateError;

        return new Response(
          JSON.stringify({
            item: updatedItem,
            product: item.products
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      case 'generate': {
        const { productId, quantity } = await req.json();
        
        const items = [];
        for (let i = 0; i < quantity; i++) {
          const qrCode = crypto.randomUUID();
          const { data: item, error } = await supabase
            .from('item_instances')
            .insert({
              product_id: productId,
              qr_code: qrCode,
            })
            .select()
            .single();

          if (error) throw error;
          items.push(item);
        }

        return new Response(
          JSON.stringify(items),
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