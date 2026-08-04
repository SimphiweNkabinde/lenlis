'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface Profile {
    name?: string
    avatarUrl?: string
}
type AuthContextType = {
    user: User | null
    session: Session | null
    loading: boolean
    profile: Profile | null
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    profile: null
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    // Memoized profile fetcher
    const fetchProfile = useCallback(async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('name, avatarUrl:avatar_url')
                .eq('id', userId)
                .maybeSingle()

            if (error) throw error
            setProfile(data)
        } catch (err) {
            console.error('Error fetching user profile:', err)
            setProfile(null)
        }
    }, [supabase])

    useEffect(() => {
        // Get initial session safely on the client
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                await fetchProfile(session.user.id)
            }
            setLoading(false)
        }

        getInitialSession()

        // Listen to real-time updates (sign in, sign out, token refreshes)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: AuthChangeEvent, currentSession: Session | null) => {
                setSession(currentSession)
                setUser(currentSession?.user ?? null)
                setLoading(false)
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase, fetchProfile])

    return (
        <AuthContext.Provider value={{ user, session, loading, profile }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to cleanly consume data in components
export const useAuth = () => useContext(AuthContext)
