import 'dotenv/config';

export default {
  expo: {
    name: 'Finding Hours',
    slug: 'finding-hours',
    version: '1.0.0',
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
};
