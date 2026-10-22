<script setup lang="ts">
import { ref, watch } from 'vue'
import { login, register, resetPassword, type AuthMode } from '../session'

const visible = defineModel<boolean>('visible', { required: true })
const mode = defineModel<AuthMode>('mode', { required: true })

const displayName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const notice = ref('')
const busy = ref(false)

// Start each opening (or mode switch) with a clean form
watch([visible, mode], () => {
  displayName.value = ''
  email.value = ''
  password.value = ''
  error.value = ''
  notice.value = ''
})

async function submit() {
  busy.value = true
  error.value = ''
  notice.value = ''
  const result =
    mode.value === 'login'
      ? await login(email.value, password.value)
      : await register(displayName.value, email.value, password.value)
  busy.value = false
  if (result) {
    error.value = result
    return
  }
  visible.value = false
}

async function forgotPassword() {
  error.value = ''
  notice.value = ''
  const result = await resetPassword(email.value)
  if (result) error.value = result
  else notice.value = `If an account exists for ${email.value.trim()}, a reset link is on its way.`
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="mode === 'login' ? 'Log in' : 'Create an account'"
    :style="{ width: '24rem' }"
    :breakpoints="{ '480px': '92vw' }"
  >
    <form class="auth-form" @submit.prevent="submit">
      <label v-if="mode === 'register'" class="field">
        <span>Display name</span>
        <InputText v-model="displayName" autocomplete="name" />
      </label>
      <label class="field">
        <span>Email</span>
        <InputText v-model="email" type="email" autocomplete="email" />
      </label>
      <label class="field">
        <span>Password</span>
        <InputText
          v-model="password"
          type="password"
          :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
        />
      </label>

      <Message v-if="error" severity="error" size="small">{{ error }}</Message>
      <Message v-if="notice" severity="success" size="small">{{ notice }}</Message>
      <p v-if="mode === 'login'" class="hint">
        <button type="button" class="link" @click="forgotPassword">Forgot password?</button>
      </p>

      <Button
        type="submit"
        :label="mode === 'login' ? 'Log in' : 'Register'"
        :loading="busy"
        class="submit"
      />

      <p class="switch">
        <template v-if="mode === 'login'">
          No account?
          <button type="button" class="link" @click="mode = 'register'">Register</button>
        </template>
        <template v-else>
          Already registered?
          <button type="button" class="link" @click="mode = 'login'">Log in</button>
        </template>
      </p>
    </form>
  </Dialog>
</template>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}
.hint,
.switch {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
}
.submit {
  background: var(--teal);
  border-color: var(--teal);
}
.link {
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  color: var(--teal);
  text-decoration: underline;
  cursor: pointer;
}
</style>
