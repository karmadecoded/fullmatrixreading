import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, dob } = req.body;
  
  console.log("📥 ===== SAVE DOB REQUEST =====");
  console.log("Email:", email);
  console.log("DOB:", dob);
  console.log("==============================");
  
  // Validate inputs
  if (!email || !dob) {
    console.error("❌ Missing email or DOB");
    return res.status(400).json({ 
      success: false,
      error: 'Missing email or DOB',
      received: { email, dob }
    });
  }

  // Validate DOB format (should be YYYY-MM-DD)
  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dobRegex.test(dob)) {
    console.error("❌ Invalid DOB format:", dob);
    return res.status(400).json({ 
      success: false,
      error: 'DOB must be in YYYY-MM-DD format',
      received: dob
    });
  }

  // Check environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error("❌ Missing environment variables!");
    return res.status(500).json({ 
      success: false,
      error: 'Server configuration error' 
    });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  try {
    // First check if user exists
    console.log("🔍 Checking if user exists...");
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('email, date_of_birth')
      .eq('email', email)
      .maybeSingle(); 

    if (checkError) {
      console.error("❌ Error checking user:", checkError);
      return res.status(500).json({ 
        success: false,
        error: 'Database error checking user',
        details: checkError.message
      });
    }

    if (!existingUser) {
      console.error("❌ User not found:", email);
      return res.status(404).json({ 
        success: false,
        error: 'User not found. Please purchase first.',
        email: email
      });
    }

    console.log("✅ User found:", existingUser);

    // Update the date_of_birth
    console.log("💾 Updating date_of_birth...");
    const { data, error } = await supabase
      .from('users')
      .update({ date_of_birth: dob })
      .ilike('email', email)
      .select();

    if (error) {
      console.error("❌ Supabase update error:", error);
      return res.status(500).json({ 
        success: false,
        error: error.message,
        code: error.code
      });
    }

    if (!data || data.length === 0) {
      console.error("❌ Update succeeded but no data returned");
      return res.status(500).json({ 
        success: false,
        error: 'Update failed - no rows affected'
      });
    }

    console.log("✅ ===== DOB SAVED SUCCESSFULLY =====");
    console.log("Updated user:", data[0]);
    console.log("=====================================");

    return res.status(200).json({ 
      success: true,
      message: 'Date of birth saved successfully',
      data: data[0]
    });

  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: err.message
    });
  }
}
