export interface User {
  [prop: string]: any;

  aid?: number;
  avatar_url?: string;
  created_at?: string;
  department?: string;
  email?: string;
  first_name?: string;
  is_outsource?: number;
  last_name?: string;
  phone_number?: string;
  projects?: object[];
  role?: string;
  status?: string;
  title?: string;
  updated_at?: string;
  user_code?: string;
  user_first_name?: string;
  user_last_name?: string;
  user_mid_name?: string;
  user_name?: string;
  profile?: any;
  isPM?: boolean;
}

export interface Token {
  [prop: string]: any;

  access_token: string;
  token_type?: string;
  expires_in?: number;
  exp?: number;
  refresh_token?: string;
  role?: string;
  profile?: object;
}
