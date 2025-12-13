import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook signature (optional but recommended)
  const signature = req.headers['x-payhip-signature'];
  if (signature && process.env.PAYHIP_WEBHOOK_SECRET) {
    const hash = crypto
      .createHmac('sha256', process.env.PAYHIP_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (hash !== signature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  const { buyer_email, sale_id } = req.body;

  if (!buyer_email) {
    return res.status(400).json({ error: 'No email provided' });
  }

  // Check if email already exists
  const { data: existing } = await supabase
    .from('users')
    .select('email')
    .eq('email', buyer_email)
    .single();

  if (existing) {
    // Email already exists, don't insert duplicate
    return res.status(200).json({ success: true, message: 'Email already exists' });
  }

  // Insert new user
  const { error } = await supabase
    .from('users')
    .insert([{ email: buyer_email }]);

  if (error) {
    console.error('Supabase error:', error);
    return res.status(400).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
