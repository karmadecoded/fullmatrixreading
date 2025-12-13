import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // LOG EVERYTHING
  console.log('🔔 Webhook received!');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { buyer_email, sale_id } = req.body;
  
  console.log('📧 Email:', buyer_email);
  console.log('🆔 Sale ID:', sale_id);

  if (!buyer_email) {
    console.error('❌ No email provided!');
    return res.status(400).json({ error: 'No email provided', receivedBody: req.body });
  }

  // Check if email already exists
  console.log('🔍 Checking if email exists...');
  const { data: existing } = await supabase
    .from('users')
    .select('email')
    .eq('email', buyer_email)
    .single();

  if (existing) {
    console.log('ℹ️ Email already exists');
    return res.status(200).json({ success: true, message: 'Email already exists' });
  }

  // Insert new user
  console.log('💾 Inserting email into Supabase...');
  const { error } = await supabase
    .from('users')
    .insert([{ email: buyer_email }]);

  if (error) {
    console.error('❌ Supabase error:', error);
    return res.status(400).json({ error: error.message });
  }

  console.log('✅ Success! Email added:', buyer_email);
  return res.status(200).json({ success: true, email: buyer_email });
}
