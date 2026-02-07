import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
	if (_supabase) return _supabase;
	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error(
			"Supabase environment variables are required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
		);
	}
	_supabase = createClient(supabaseUrl, supabaseAnonKey);
	return _supabase;
}

export const supabase: any = new Proxy(
	{} as Record<string | number | symbol, unknown>,
	{
		get(_target, prop) {
			const client = getSupabaseClient();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const value = (client as any)[prop];
			if (typeof value === "function") return value.bind(client);
			return value;
		},
	}
);
