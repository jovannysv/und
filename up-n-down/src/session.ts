import { reactive, readonly } from 'vue'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import type { UserProfile } from './types'

export interface SessionUser {
  uid: string
  email: string
  displayName: string
}

export type AuthMode = 'login' | 'register'

// `ready` stays false until Firebase reports whether someone is already
// signed in, so the header doesn't flash "Login" for returning users.
const state = reactive<{ user: SessionUser | null; ready: boolean }>({ user: null, ready: false })

export const session = readonly(state)

// Firebase keeps the user signed in across reloads; this fires on page load
// and again after every login, register and logout.
onAuthStateChanged(auth, (user) => {
  state.user = user
    ? { uid: user.uid, email: user.email ?? '', displayName: user.displayName || user.email || 'there' }
    : null
  state.ready = true
})

// The login/register dialog, shared so any page (e.g. the Save button) can open it
export const authPrompt = reactive<{ open: boolean; mode: AuthMode }>({ open: false, mode: 'login' })

export function openAuth(mode: AuthMode) {
  authPrompt.mode = mode
  authPrompt.open = true
}

function errorMessage(err: unknown): string {
  const code = err instanceof FirebaseError ? err.code : ''
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a minute and try again.'
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled in the Firebase console.'
    case 'auth/network-request-failed':
      return 'Could not reach the server. Check your connection.'
    default:
      console.error('Auth error:', err)
      return 'Something went wrong. Please try again.'
  }
}

// Each function resolves to an error message, or null on success.
export async function login(email: string, password: string): Promise<string | null> {
  try {
    await signInWithEmailAndPassword(auth, email.trim(), password)
    return null
  } catch (err) {
    return errorMessage(err)
  }
}

export async function register(displayName: string, email: string, password: string): Promise<string | null> {
  const name = displayName.trim()
  if (!name || !email.trim() || !password) return 'Please fill in every field.'
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password)
    await updateProfile(user, { displayName: name })
    // onAuthStateChanged fired before the name was set, so refresh it here
    state.user = { uid: user.uid, email: user.email ?? '', displayName: name }

    const profile: UserProfile & { createdAt: unknown } = {
      displayName: name,
      preferences: { interests: [], indoorOutdoor: 'either' },
      createdAt: serverTimestamp(),
    }
    await setDoc(doc(db, 'users', user.uid), profile)
    return null
  } catch (err) {
    return errorMessage(err)
  }
}

export async function resetPassword(email: string): Promise<string | null> {
  if (!email.trim()) return 'Enter your email above first.'
  try {
    await sendPasswordResetEmail(auth, email.trim())
    return null
  } catch (err) {
    return errorMessage(err)
  }
}

export function logout(): Promise<void> {
  return signOut(auth)
}
