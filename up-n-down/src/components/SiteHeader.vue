<script setup lang="ts">
import logo from '../assets/logo.png'
import { authPrompt, logout, openAuth, session } from '../session'
import { CATEGORIES, clearSearch, nav, showFavorites, showResults, toggleCategory } from '../navigation'
import AuthDialog from './AuthDialog.vue'

function goHome() {
  clearSearch()
  showResults()
}
</script>

<template>
  <header class="header">
    <div class="header-top">
      <a href="/" class="logo" @click.prevent="goHome">
        <img :src="logo" alt="Up'n Down Chucktown" />
      </a>

      <form class="search" role="search" @submit.prevent="showResults">
        <input v-model="nav.keyword" class="search-input" type="search" placeholder="Search" aria-label="Search" />
        <button type="submit" class="search-button" aria-label="Search">
          <svg width="22" height="22" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.17" stroke-linecap="round" aria-hidden="true">
            <path d="M11.92 19.5a7.58 7.58 0 1 0 0-15.17 7.58 7.58 0 0 0 0 15.17ZM21.67 21.67l-3.8-3.8" />
          </svg>
        </button>
      </form>

      <div v-if="session.user" class="auth-actions">
        <span class="greeting">Hi, {{ session.user.displayName }}</span>
        <button type="button" class="btn btn-login" @click="showFavorites">
          <i class="pi pi-heart" aria-hidden="true"></i> Favorites
        </button>
        <button type="button" class="btn btn-login" @click="logout">Log out</button>
      </div>
      <div v-else-if="session.ready" class="auth-actions">
        <button type="button" class="btn btn-login" @click="openAuth('login')">Login</button>
        <button type="button" class="btn btn-register" @click="openAuth('register')">Register</button>
      </div>
      <AuthDialog v-model:visible="authPrompt.open" v-model:mode="authPrompt.mode" />
    </div>

    <nav class="nav-categories" aria-label="Categories">
      <button
        v-for="category in CATEGORIES"
        :key="category.value"
        type="button"
        class="nav-item"
        :class="{ active: nav.category === category.value }"
        :aria-pressed="nav.category === category.value"
        @click="toggleCategory(category.value)"
      >
        {{ category.label }}
      </button>
    </nav>
  </header>
</template>

<style scoped>
.header {
  border-bottom: 1px solid var(--line);
  background: var(--surface);
}

.header-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
  padding: 12px 24px 4px;
}

/* logo.png has a lot of empty margin, so crop it to the lettering */
.logo {
  display: block;
  width: 108px;
  height: 56px;
  overflow: hidden;
}

.logo img {
  display: block;
  width: 190px;
  max-width: none;
  margin: -17px 0 0 -41px;
}

.search {
  display: flex;
  flex: 0 1 320px;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
}

.search-input {
  flex: 1;
  min-width: 0;
  padding: 14px 20px;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  font-size: 18px;
  color: var(--ink);
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  border: none;
  background: var(--teal);
  color: #fff;
  cursor: pointer;
}

.auth-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.greeting {
  font-size: 15px;
  font-weight: 500;
  color: var(--ink);
}

.btn {
  padding: 9px 18px;
  border-radius: 999px;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.btn-login {
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
}

.btn-register {
  border: 1px solid var(--teal);
  background: var(--teal);
  color: #fff;
}

.nav-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 24px;
  padding: 4px 24px 12px;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 16px;
  font-weight: 500;
  color: var(--ink);
  cursor: pointer;
}

.nav-item.active {
  color: var(--teal);
  box-shadow: inset 0 -2px 0 var(--teal);
}

@media (max-width: 960px) {
  .search {
    order: 3;
    flex-basis: 100%;
  }
}
</style>
