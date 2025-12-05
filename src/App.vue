<template>
  <main>
    <router-view />
  </main>
</template>

<style lang="scss">
:root {
  --color-white: #ffffff;
  --color-bg-primary: #F8F8FA;
  --color-primary-text: #3C4557;
  --color-secondary-text: #707888;
  --color-chip-primary: #F2F6FE;
  --color-chip-text-primary: #5888DB;

  --color-border: #E7E7EC;
  --color-placeholder: #6F7787;
  --color-success: #07A88D;

  --header-height: 4.375rem;
}

* {
  box-sizing: border-box;
}

html {
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-bg-primary);
  font-family: Inter, sans-serif;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 auto;
}

.flex {
  display: flex;
}

.flex-direction-column {
  flex-direction: column;
}

.align-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.full-width {
  width: 100%;
}

.text-uppercase {
  text-transform: uppercase;
}

.bg-white { background-color: var(--color-white); }
.bg-chip-primary { background-color: var(--color-chip-primary); }
.bg-success { background-color: var(--color-success); }

.text-chip-text-primary { color: var(--color-chip-text-primary); }
.text-white { color: var(--color-white); }
.text-primary { color: var(--color-primary-text); }
.text-secondary { color: var(--color-secondary-text); }

.font-bold { font-weight: 600; }
</style>
