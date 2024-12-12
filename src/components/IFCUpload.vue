<template>
  <div class="bg-inherit">
    <div class="text-2xl text-white font-thin">
      <span class="material-symbols-outlined mx-2 font-thin"> deployed_code_update </span
      >Uploaded Models
    </div>
    <div class="mt-2">
      <div class="btn btn-xs ml-2" @click="uploadIFC">upload new model</div>
      <input type="file" id="fileInput" accept=".ifc" style="display: none" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    uploadIFC: {
      type: Function,
      required: true,
    },
  },
};
</script>
