import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // LOG EVERYTHING
  console.log('🔔 ========== WEBHOOK RECEIVED ==========');
  console.log('📋 Method:', req.method);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('📋 Body:', JSON.stringify(req.body, null, 2));
  console.log('========================================');
  
  if (req.method !== 'POST') {
    console.log('❌ Wrong method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Try multiple possible field names that Payhip might use
  const email = req.body.buyer_email || 
                req.body.email || 
                req.body.customer_email ||
                req.body.purchaser_email;
  
  const saleId = req.body.sale_id || 
                 req.body.transaction_id || 
                 req.body.order_id;
  
  console.log('📧 Extracted Email:', email);
  console.log('🆔 Extracted Sale ID:', saleId);

  if (!email) {
    console.error('❌ NO EMAIL FOUND!');
    console.error('Available fields:', Object.keys(req.body));
    return res.status(400).json({ 
      error: 'No email found', 
      receivedFields: Object.keys(req.body),
      receivedBody: req.body 
    });
  }

  // Check environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('❌ MISSING ENVIRONMENT VARIABLES!');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Check if email already exists
    console.log('🔍 Checking if email exists...');
    const { data: existing, error: checkError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Database check error:', checkError);
      return res.status(500).json({ error: checkError.message });
    }

    if (existing) {
      console.log('ℹ️ Email already exists:', email);
      return res.status(200).json({ 
        success: true, 
        message: 'Email already exists',
        email: email 
      });
    }

    // Insert new user - date_of_birth will be null until user enters it
    console.log('💾 Inserting email into Supabase...');
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        email: email,
        sale_id: saleId,
        date_of_birth: null,  // Will be filled in later when user logs in
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('✅ SUCCESS! Email added:', email);
    console.log('✅ Data returned:', data);
    return res.status(200).json({ 
      success: true, 
      email: email,
      data: data 
    });

  } catch (err) {
    console.error('❌ UNEXPECTED ERROR:', err);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: err.message 
    });
  }
}
