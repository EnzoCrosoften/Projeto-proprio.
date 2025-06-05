
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const username = url.pathname.split('/').pop()

    if (!username) {
      return new Response('Username required', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user by username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (userError || !user) {
      return new Response('User not found', { 
        status: 404, 
        headers: corsHeaders 
      })
    }

    // Get active phone numbers for this user
    const { data: phoneNumbers, error: phoneError } = await supabase
      .from('phone_numbers')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('order_position', { ascending: true })

    if (phoneError || !phoneNumbers || phoneNumbers.length === 0) {
      return new Response('No active phone numbers found', { 
        status: 404, 
        headers: corsHeaders 
      })
    }

    // Simple round-robin: get the phone number with least clicks
    const selectedPhone = phoneNumbers.reduce((prev, current) => 
      (prev.clicks_count <= current.clicks_count) ? prev : current
    )

    // Get client info for analytics
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Try to get location info from IP (simplified version)
    let locationData = {
      country: 'Unknown',
      city: 'Unknown',
      state: 'Unknown'
    }

    try {
      // You can integrate with a geolocation API here
      // For now, we'll use a simple approach
      const geoResponse = await fetch(`http://ip-api.com/json/${clientIP}`)
      if (geoResponse.ok) {
        const geoData = await geoResponse.json()
        locationData = {
          country: geoData.country || 'Unknown',
          city: geoData.city || 'Unknown',
          state: geoData.regionName || 'Unknown'
        }
      }
    } catch (error) {
      console.error('Geolocation error:', error)
    }

    // Record the click
    const { error: clickError } = await supabase
      .from('clicks')
      .insert({
        user_id: user.id,
        phone_number_id: selectedPhone.id,
        phone_number: selectedPhone.number,
        ip_address: clientIP,
        user_agent: userAgent,
        country: locationData.country,
        city: locationData.city,
        state: locationData.state,
      })

    if (clickError) {
      console.error('Error recording click:', clickError)
    }

    // Update click count for the phone number
    const { error: updateError } = await supabase
      .from('phone_numbers')
      .update({ 
        clicks_count: selectedPhone.clicks_count + 1 
      })
      .eq('id', selectedPhone.id)

    if (updateError) {
      console.error('Error updating click count:', updateError)
    }

    // Create WhatsApp redirect URL
    const whatsappUrl = `https://wa.me/${selectedPhone.number.replace(/\+/g, '')}`

    // Return redirect response
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': whatsappUrl,
      },
    })

  } catch (error) {
    console.error('Error in redirect function:', error)
    return new Response('Internal server error', { 
      status: 500, 
      headers: corsHeaders 
    })
  }
})
