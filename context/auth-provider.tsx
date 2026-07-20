'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User as user, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface User extends user {
    username?: string,
    avatarUrl?: string,
    name?: string,
}
type AuthContextType = {
    user: User | null
    session: Session | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        if (user?.id) {
            supabase.from("profiles").select("name, username, avatarUrl:avatar_url").eq("id", user.id).single()
                .then(({ data, error }) => setUser(
                    (currVal) => currVal ? ({ ...currVal, username: data?.username, avatarUrl: data?.avatarUrl, name: data?.name }) : currVal)
                )
        }
    }, [user?.id])

    useEffect(() => {
        // Get initial session safely on the client
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)
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
    }, [supabase])

    return (
        <AuthContext.Provider value={{ user, session, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to cleanly consume data in components
export const useAuth = () => useContext(AuthContext)
