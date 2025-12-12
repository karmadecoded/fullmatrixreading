import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // service key, not public anon
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body; // Payhip sends buyer email

    const { error } = await supabase
      .from('users')
      .insert([{ email }]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
