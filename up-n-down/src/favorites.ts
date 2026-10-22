import { reactive, watch } from 'vue'
import { collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from 'firebase/firestore'
import { db } from './firebase'
import { session } from './session'
import type { FavoriteEntry } from './types'

// Saved listing IDs for the signed-in user, newest first. Stored at
// users/{uid}/favorites/{businessId}, so saving the same listing twice is a no-op.
const state = reactive<{ ids: string[] }>({ ids: [] })

let unsubscribe: Unsubscribe | undefined

// Live-sync favorites whenever someone signs in; clear them on sign-out.
watch(
  () => session.user?.uid,
  (uid) => {
    unsubscribe?.()
    unsubscribe = undefined
    state.ids = []
    if (!uid) return

    unsubscribe = onSnapshot(collection(db, 'users', uid, 'favorites'), (snap) => {
      // A just-saved favorite has no server time yet; 'estimate' fills it in
      state.ids = snap.docs
        .map((d) => ({ id: d.id, savedAt: d.data({ serverTimestamps: 'estimate' }).savedAt?.toMillis() ?? 0 }))
        .sort((a, b) => b.savedAt - a.savedAt)
        .map((f) => f.id)
    })
  },
  { immediate: true },
)

function favoriteRef(id: string) {
  return doc(db, 'users', session.user!.uid, 'favorites', id)
}

export function favoriteIds(): string[] {
  return state.ids
}

export function isFavorite(id: string): boolean {
  return state.ids.includes(id)
}

export async function addFavorite(id: string) {
  if (!session.user || isFavorite(id)) return
  await setDoc(favoriteRef(id), { savedAt: serverTimestamp() } satisfies Record<keyof FavoriteEntry, unknown>)
}

export async function removeFavorite(id: string) {
  if (!session.user) return
  await deleteDoc(favoriteRef(id))
}
