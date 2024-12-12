<template>
  <div
    id="UIManager"
    class="bg-inherit text-white px-2 flex pointer-events-auto rounded z-1000"
    @click="testMethod"
  >
    <div id="ifc-upload" class="btn">Upload IFC Model</div>
    <input type="file" id="fileInput" accept=".ifc" style="display:none;">

    <input type="checkbox" class="toggle" id="ifc-explode" />
  </div>
</template>

<script lang="ts">
export default {
  components: {},
  data() {
    return {
      activeSection: "general", // Default active section
    };
  },
  methods: {
    setActiveSection(section: string) {
      this.activeSection = section;
    },
    testMethod() {
      console.log("section clicked");
    },
  },
};
</script>
