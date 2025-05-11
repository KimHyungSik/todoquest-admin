import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // 환경변수 누락 시 경고
  // 실제 서비스에서는 더 강력한 에러 핸들링 필요
  // eslint-disable-next-line no-console
  console.error('Supabase 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 