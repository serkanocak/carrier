import { createContext, useContext, useEffect, useState } from 'react'
import {
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'

const AuthContext = createContext(null)

export const ADMIN_EMAIL = 'serkanocak@gmail.com'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
            setLoading(false)
        })
        return unsub
    }, [])

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const u = result.user
            // Save to Firestore on first login
            const ref = doc(db, 'members', u.uid)
            const snap = await getDoc(ref)
            if (!snap.exists()) {
                await setDoc(ref, {
                    name: u.displayName,
                    email: u.email,
                    photoURL: u.photoURL,
                    joinedAt: serverTimestamp(),
                })
            }
        } catch (err) {
            console.error('Sign in error:', err.code, err.message)
        }
    }

    const signOut = () => firebaseSignOut(auth)

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
