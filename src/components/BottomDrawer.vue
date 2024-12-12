<template>
  <div class="lg:block hidden">
    <div
      class="h-32 w-[1000px] bg-base-100 shadow-xl border border-amber-500 rounded-r-lg fixed bottom-0 left-1/2 transform -translate-x-1/2"
      v-if="showBottomDrawer"
    >
      <div
        class="btn btn-xs fixed -top-4 border border-amber-500"
        @click="toggleShowBottomDrawer"
      >
        <span class="material-symbols-outlined"> keyboard_arrow_down </span>
      </div>
      <div class="flex p-2">
        <div class="flex w-full">
          <div
            class="grid grid-cols-4 h-24 flex-grow bg-base-300 rounded-md place-items-center mt-2 w-fit"
          >
            <div class="btn btn-xs text-xs h-fit w-28">
              <span class="material-symbols-outlined text-lg text-lg">
                deployed_code </span
              >IFC
            </div>
            <div class="btn btn-xs text-xs h-fit w-28">
              <span class="material-symbols-outlined text-lg"> grid_on </span
              >Fragments
            </div>
            <div class="btn btn-xs text-xs h-fit w-28">
              <span class="material-symbols-outlined text-lg"> grid_4x4 </span
              >Tiles
            </div>
            <div class="btn btn-xs text-xs h-fit w-28">
              <span class="material-symbols-outlined text-lg"> download </span
              >Import
            </div>
            <div
              class="tooltip tooltip-right"
              data-tip="double click to start measuring angles, use the delete key to remove measurements"
            >
              <div class="btn btn-xs text-xs h-fit w-28">
                <input
                  type="checkbox"
                  class="toggle toggle-xs h-fit"
                  id="angles"
                />Angles
              </div>
            </div>
            <div class="btn btn-xs text-xs h-fit w-28">
              <span class="material-symbols-outlined text-lg">
                crop_square </span
              >Area
            </div>
            <div
              class="tooltip"
              data-tip="double click to create clipping plane, use the delete key to delete clipping planes"
            >
              <div class="btn btn-xs text-xs h-fit w-28 h-fit">
                <input
                  type="checkbox"
                  class="toggle toggle-xs h-fit"
                  id="clippers"
                />Clippers
              </div>
            </div>

            <div class="btn btn-xs text-xs h-fit w-28" data-tip="">
              <span class="material-symbols-outlined text-lg">
                arrow_and_edge </span
              >Edge
            </div>
          </div>
          <div class="divider divider-horizontal"></div>
          <div
            class="grid grid-cols-4 h-24 flex-grow bg-base-300 rounded-md place-items-center mt-2"
          >
            <div class="btn btn-xs text-xs h-fit w-28" id="fit-model-view">
              <span class="material-symbols-outlined text-lg"> view_in_ar </span
              >Fit Model
            </div>
            <div class="btn btn-xs text-xs h-fit w-28">
              <input
                type="checkbox"
                class="toggle toggle-xs h-fit"
                id="ifc-hider"
              />
              Visibility
            </div>
            <div class="btn btn-xs text-xs h-fit w-28">
              <input
                type="checkbox"
                class="toggle toggle-xs h-fit"
                id="ifc-explode"
              />Explode
            </div>
            <div class="btn btn-xs text-xs h-fit w-28">
              <span class="material-symbols-outlined text-lg"> filter_alt </span
              >Isolate
            </div>

            <div class="btn btn-xs text-xs h-fit w-28">
              <span class="material-symbols-outlined text-lg"> straighten </span
              >Face
            </div>
            <div class="btn btn-xs text-xs h-fit w-28">
              <span class="material-symbols-outlined text-lg">
                explore_nearby </span
              >Markers
            </div>
            <div class="btn btn-xs text-xs h-fit w-28">
              <span class="material-symbols-outlined text-lg"> dashboard </span
              >Blueprint
            </div>
            <div class="btn btn-xs text-xs h-fit w-28">
              <span class="material-symbols-outlined text-lg">
                dashboard_customize </span
              >Volume
            </div>
          </div>
        </div>
        <!-- <div class="flex flex-col mr-2">
          <div class="h-fit"><p class="text-xs">explode</p></div>
          <div>
            <input
              type="checkbox"
              class="toggle toggle-xs h-fit"
              id="ifc-explode"
            />
          </div>
        </div>
        <div class="flex flex-col mr-2">
          <div class="h-fit"><p class="text-xs">visibility</p></div>
          <input type="checkbox" class="toggle toggle-xs h-fit" id="ifc-hider" />
        </div>
        <div></div> -->
      </div>
    </div>
    <div v-if="!showBottomDrawer" class="fixed h-0 w-96 right-80 bottom-0">
      <div
        class="btn btn-xs fixed bottom-0 left-[550px] border border-amber-500 animate-bounce"
        @click="toggleShowBottomDrawer"
      >
        <span class="material-symbols-outlined"> keyboard_arrow_up </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      showBottomDrawer: false,
    };
  },
  methods: {
    toggleShowBottomDrawer() {
      this.showBottomDrawer = !this.showBottomDrawer;
    },
  },
};
</script>

<style scoped>
/* Define the transition for the slide effect */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave, .slide-enter-to /* .slide-enter-active in <2.1.8 */ {
  transform: translateX(0);
  opacity: 1;
}
</style>
