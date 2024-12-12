<template>
  <div class="navbar bg-[#111115] hidden" id="navbar">
    <div class="flex-1">
      <router-link to="/" class="btn btn-ghost text-xl">Airtight</router-link>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li>
          <router-link to="/model" id="model-link" @click="hideNavbar"
            >Model</router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
function hideNavbar() {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    navbar.style.visibility = "hidden";
    // navbar.style.zIndex = 55;
  }
}
</script>
