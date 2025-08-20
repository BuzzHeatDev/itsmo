// Authentication helpers for Supabase
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseAuth = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error);
    throw error;
  }

  return data;
}

/**
 * Sign out current user
 */
export async function signOut() {
  const { error } = await supabaseAuth.auth.signOut();

  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabaseAuth.auth.getUser();

  if (error) {
    console.error('Get user error:', error);
    return null;
  }

  return user;
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabaseAuth.auth.getSession();

  if (error) {
    console.error('Get session error:', error);
    return null;
  }

  return session;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const session = await getCurrentSession();
  return !!session?.user;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  return supabaseAuth.auth.onAuthStateChange(callback);
}

/**
 * Sign up new user (for admin setup)
 */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabaseAuth.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Sign up error:', error);
    throw error;
  }

  return data;
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  const { error } = await supabaseAuth.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    console.error('Reset password error:', error);
    throw error;
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  const { error } = await supabaseAuth.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Update password error:', error);
    throw error;
  }
}
