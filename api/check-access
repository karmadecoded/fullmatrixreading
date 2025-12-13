import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const { email } = req.body;
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
  
  const { data, error } = await supabase
    .from('users') 
    .select('email, date_of_birth')
    .eq('email', email)
    .single();
  
  if (data) {
    res.json({
      hasAccess: true,
      hasDOB: !!data.date_of_birth,
      date_of_birth: data.date_of_birth
    });
  } else {
    res.json({ hasAccess: false });
  }
}
