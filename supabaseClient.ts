import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

const extra = Constants.expoConfig?.extra || Constants.manifest?.extra;

const SUPABASE_URL = extra.supabaseUrl;
const SUPABASE_ANON_KEY = extra.supabaseAnonKey;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
