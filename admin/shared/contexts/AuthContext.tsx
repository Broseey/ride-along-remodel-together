import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "./../integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: Record<string, any> | null;
  driverProfile: Record<string, any> | null;
  adminProfile: Record<string, any> | null;
  isLoading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phoneNumber?: string
  ) => Promise<{ error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  driverSignUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: unknown }>;
  driverSignIn: (
    email: string,
    password: string
  ) => Promise<{ error: unknown }>;
  adminSignIn: (email: string, password: string) => Promise<{ error: unknown }>;
  createAdminAccount: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: unknown }>;
  signInWithGoogle: () => Promise<{ error: unknown }>;
  driverSignInWithGoogle: () => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<Record<string, any> | null>(
    null
  );
  const [driverProfile, setDriverProfile] = useState<Record<
    string,
    any
  > | null>(null);
  const [adminProfile, setAdminProfile] = useState<Record<string, any> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfiles = async (userId: string) => {
    try {
      // Try to fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      setUserProfile(profile);

      // Try to fetch driver profile
      const { data: driverProf } = await supabase
        .from("driver_profiles")
        .select("*")
        .eq("id", userId)
        .single();
      setDriverProfile(driverProf);

      // Try to fetch admin profile
      const { data: adminProf } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", userId)
        .single();
      setAdminProfile(adminProf);
    } catch (error) {
      console.log("Error fetching profiles:", error);
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfiles(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch user profiles after authentication (defer to avoid race)
        setTimeout(async () => {
          await fetchUserProfiles(session.user.id);
          setIsLoading(false);
        }, 0);
      } else {
        setUserProfile(null);
        setDriverProfile(null);
        setAdminProfile(null);
        setIsLoading(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phoneNumber?: string
  ) => {
    const redirectUrl = `${window.location.origin}/dashboard`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
        },
      },
    });
    // Insert profile row if sign up succeeded
    if (!error && data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        email: email,
        phone_number: phoneNumber || null,
      });
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const driverSignUp = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    const redirectUrl = `${window.location.origin}/driver-dashboard`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          is_driver: true,
        },
      },
    });
    return { error };
  };

  const driverSignIn = async (email: string, password: string) => {
    // First, attempt to sign in
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      // After successful sign-in, check if this user has a driver profile
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: driverProfile } = await supabase
          .from("driver_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!driverProfile) {
          // User doesn't have a driver profile, sign them out and return error
          await supabase.auth.signOut();
          return {
            error: {
              message:
                "No driver account found for this email. Please sign up as a driver first.",
            },
          };
        }
      }
    }

    return { error };
  };

  const adminSignIn = async (email: string, password: string) => {
    // First, attempt to sign in
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      // After successful sign-in, check if this user has an admin profile
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: adminProfile } = await supabase
          .from("admin_users")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!adminProfile || !adminProfile.is_active) {
          // User doesn't have an admin profile, sign them out and return error
          await supabase.auth.signOut();
          return {
            error: { message: "No admin privileges found for this account." },
          };
        }
      }
    }

    return { error };
  };

  const createAdminAccount = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    try {
      // First create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        return { error: authError };
      }

      if (authData.user) {
        // Create admin profile
        const { error: adminError } = await supabase
          .from("admin_users")
          .insert({
            user_id: authData.user.id,
            admin_level: "super_admin",
            is_active: true,
          });

        if (adminError) {
          return { error: adminError };
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/dashboard`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    // After redirect, onAuthStateChange will fire. But for immediate profile creation, also check here:
    if (!error) {
      // Wait a moment for session to be set
      setTimeout(async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          // Check if profile exists
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          if (!profile) {
            await supabase.from("profiles").insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email,
              email: user.email,
              phone_number: user.phone || null,
            });
          }
        }
      }, 1000); // Wait 1s to ensure session is available
    }
    return { error };
  };

  const driverSignInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/driver-dashboard`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          is_driver: "true",
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserProfile(null);
    setDriverProfile(null);
    setAdminProfile(null);
  };

  const value = {
    user,
    session,
    userProfile,
    driverProfile,
    adminProfile,
    isLoading,
    signUp,
    signIn,
    driverSignUp,
    driverSignIn,
    adminSignIn,
    createAdminAccount,
    signInWithGoogle,
    driverSignInWithGoogle,
    signOut,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
