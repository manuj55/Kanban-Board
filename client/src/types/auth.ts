// ═══════════════════════════════════════════════════════════════
// Auth & User Types (Client)
// ═══════════════════════════════════════════════════════════════

// User representation in client state
export interface User {
  id: string; // Backend _id normalized
  email: string;
  name: string;
  createdAt: string;
}

// API response from login/register
export interface AuthResponse {
  user: User;
  message: string;
}

// Form data for login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Form data for registration
export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

// Redux auth state shape
export interface AuthState {
  user: User | null;
  token: string | null; // Not used with httpOnly cookies, kept for future
  loading: boolean;
  error: string | null;
}
