// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fxddcrckfcswhkpxcvfv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4ZGRjcmNrZmNzd2hrcHhjdmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyOTYxNDIsImV4cCI6MjA1OTg3MjE0Mn0.KITWtUHMV9_oTAHU8e-_GClEhl6iJeKnIUpxK7g-JEM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);