import { createContext, useContext, useEffect, useState } from 'react'
import {
    signInWithRedirect,
    getRedirectResult,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'

const AuthContext = createContext(null)

export const ADMIN_EMAIL = 'serkanocak@gmail.com'

async function saveMemberIfNew(u) {
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
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Handle redirect result after Google redirects back
        getRedirectResult(auth)
            .then(async (result) => {
                if (result?.user) {
                    await saveMemberIfNew(result.user)
                }
            })
            .catch((err) => console.error('Redirect result error', err))

        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
            setLoading(false)
        })
        return unsub
    }, [])

    const signInWithGoogle = () => {
        signInWithRedirect(auth, googleProvider)
    }

    const signOut = () => firebaseSignOut(auth)

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
