<template>
  <div class="">
    <!-- Transition wrapper for the side drawer -->
    <transition name="slide">
      <div
        v-if="showDrawer"
        class="h-screen w-[550px] opacity-90 w-min-sm bg-base-100 shadow-xl fixed border border-amber-500 overflow-auto lg:block hidden"
      >
        <div
          class="btn btn-sm absolute right-2 top-2 border border-amber-500"
          @click="toggleDrawer"
        >
          <span class="material-symbols-outlined"> keyboard_arrow_left </span>
        </div>
        <div class="p-4">
          <div class="my-2"><IFCUpload :uploadIFC="uploadIFC" /></div>
          <div
            v-for="(model, index) in modelData"
            :key="index"
            class="ml-4 my-4"
          >
            <p class="text-slate-200 text-sm font-thin">
              {{ model.name }}

              <span
                class="material-symbols-outlined text-sm float-right btn btn-xs text-red-500 mx-1 font-thin"
                @click="deleteIFC(model.name, model.uuid)"
              >
                delete
              </span>
              <Visibility />
            </p>
            <div
              class="badge badge-xs badge-outline badge-primary mr-1"
              v-if="model.schema?.length > 0"
            >
              {{ model.schema }}
            </div>
            <div
              class="badge bg-amber-500 text-black text-xs font-semibold"
              v-if="model.viewDefinition?.length > 0"
            >
              {{ model.viewDefinition }}
            </div>
          </div>
          <div class="divider"></div>
          <div class="collapse bg-base-200">
            <input type="checkbox" />
            <div class="collapse-title">
              <div class="text-xl font-thin text-white">
                <span class="material-symbols-outlined text-sm mx-2">
                  linked_services </span
                >Spatial Structures
                <span
                  v-if="classes.length > 0"
                  class="text-white badge badge-xs font-thin float-right mt-2 ring-1 ring-amber-500 rounded-lg"
                  >{{ classes.length }}</span
                >
              </div>
            </div>
            <div class="collapse-content">
              <MetadataAttributes :classes="classes" />
            </div>
          </div>
          <!-- <div class="collapse bg-base-200">
            <input type="checkbox" />
            <div class="collapse-title">
              <div class="text-sm font-medium text-white">
                <span class="material-symbols-outlined mx-2 text-sm">
                  linked_services </span
                >Spatial Structures
              </div>
            </div>
            <div class="collapse-content">
              <div v-for="(s, index) in spatial" :key="index" class="ml-4 my-4">
                {{
                  //@ts-ignore
                  s.structure
                }}
              </div>
            </div>
          </div> -->
          <div class="divider"></div>
          <span
            class="badge badge-sm mx-2 mt-2 hover:border-amber-500 hover:text-amber-500 float-right tooltip tooltip-left"
            data-tip="hold control and select members"
          >
            help
          </span>
          <div class="text-2xl font-thin text-white">
            <span class="material-symbols-outlined mx-2"> inbox_customize </span
            >Custom Selections
            <!-- <input
              type="checkbox"
              class="toggle toggle-warning float-right"
              id="custom-selections"
            /> -->
          </div>
          <div
            class="btn btn-sm w-full my-4"
            @click="toggleCustomSelection"
            v-if="!showCustomSelection"
          >
            save selection
          </div>

          <div v-if="showCustomSelection" class="grid grid-cols-2 gap-2 my-4">
            <input
              type="text"
              placeholder="Project Name"
              class="input input-bordered w-full max-w-xs"
              v-model="projectName"
            />

            <input
              type="text"
              placeholder="Estimated Budget"
              class="input input-bordered w-full max-w-xs"
              v-model="estimatedBudget"
            />

            <label class="form-control w-full max-w-xs">
              <input
                type="date"
                placeholder="Type here"
                class="input input-bordered w-full max-w-xs"
                v-model="estimatedStartDate"
              />
              <div class="label">
                <span class="label-text-alt text-amber-300"
                  >Estimated Start Date</span
                >
              </div>
            </label>

            <label class="form-control w-full max-w-xs">
              <input
                type="date"
                placeholder="Type here"
                class="input input-bordered w-full max-w-xs"
                v-model="estimatedEndDate"
              />
              <div class="label">
                <span class="label-text-alt text-amber-300"
                  >Estimate Completion Date</span
                >
              </div>
            </label>
          </div>
          <div
            v-if="showCustomSelection"
            v-for="(selection, index) in customSelectionMetadata"
            :key="index"
          >
            <div class="overflow-x-auto">
              <table class="table">
                <!-- head -->
                <thead>
                  <tr></tr>
                </thead>
                <tbody>
                  <!-- row 1 -->
                  <tr class="hover" id="selected-table">
                    <th>{{ index }}</th>
                    <td>
                      {{
                        //@ts-ignore
                        selection.Name
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            class="join join-vertical lg:join-horizontal float-right my-2"
            v-if="showCustomSelection"
          >
            <button
              class="btn btn-sm join-item border border-error"
              @click="toggleCustomSelection"
            >
              Cancel
            </button>
            <button
              class="btn btn-sm join-item border border-success"
              @click="submitCustomSelections"
            >
              Submit
            </button>
          </div>
          <div class="divider mt-8"></div>
        </div>
        <div class="text-2xl font-thin text-white">
          <span class="material-symbols-outlined mx-2"> inbox_customize </span
          >Saved Selections
        </div>
        <div
          v-if="submitSelections.length > 0"
          v-for="submit in submitSelections"
          class="px-2 my-2"
        >
          <details class="collapse bg-base-200">
            <summary class="collapse-title text-xl font-medium">
              <h2 class="text-lg font-semibold text-amber-300">
                {{ submit.ProjectName }}
                <span class="badge badge-lg border border-primary float-right">{{
                  submit.StartDate
                }}</span>
                <span class="badge badge-lg border border-primary float-right">{{
                  submit.EndDate
                }}</span>
              </h2>
            </summary>
            <div class="collapse-content">
              <div v-for="submissionData in submit.CustomSelectedMetadata">
                {{ submissionData.Name }}
              </div>
            </div>
          </details>
        </div>
      </div>
    </transition>
    <!-- Transition wrapper for the side drawer -->
    <transition name="slide">
      <div v-if="!showDrawer" class="fixed left-0">
        <div
          class="btn btn-sm absolute -right-16 top-1 border border-amber-500"
          @click="toggleDrawer"
        >
          <span class="material-symbols-outlined"> menu </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
//@ts-ignore
import { ref, watch, defineComponent, PropType } from "vue";
//@ts-ignore
import IFCUpload from "../components/IFCUpload.vue";
import { ClassOrganizationItem, IModelMetaData } from "../interfaces/model";
import MetadataAttributes from "../components/MetadataAttributes.vue";
import DatePicker from "primevue/datepicker";

export default {
  props: {
    uploadIFC: {
      type: Function,
      required: true,
    },
    deleteIFC: {
      type: Function,
      required: true,
    },
    classes: {
      type: Array as PropType<ClassOrganizationItem[]>,
      required: true,
    },
    spatial: {
      required: true,
    },
    modelData: {
      type: Array as () => IModelMetaData[],
      required: true,
    },
    customSelection: {
      required: true,
    },
    getHighlightedFragmentsMetadata: {
      type: Function,
      required: true,
    },
  },
  components: {
    IFCUpload,
    MetadataAttributes,
    DatePicker,
  },
  data() {
    return {
      showDrawer: true,
      showCustomSelection: false,
      customSelectionMetadata: null,
      date: null,
      projectName: "",
      estimatedBudget: "",
      estimatedStartDate: "",
      estimatedEndDate: "",
      submitSelections: [] as {
        ProjectName: string;
        EstimatedBudget: string;
        StartDate: string;
        EndDate: string;
        CustomSelectedMetadata: any;
      }[],
    };
  },
  methods: {
    toggleDrawer() {
      this.showDrawer = !this.showDrawer;
    },
    toggleCustomSelection() {
      this.showCustomSelection = !this.showCustomSelection;
    },
    async getHighlightedSelectionMetadata() {
      this.customSelectionMetadata = await this.getHighlightedFragmentsMetadata(
        this.customSelection
      );
    },
    submitCustomSelections() {
      this.submitSelections.push({
        ProjectName: this.projectName,
        EstimatedBudget: this.estimatedBudget,
        StartDate: this.estimatedStartDate,
        EndDate: this.estimatedEndDate,
        CustomSelectedMetadata: this.customSelectionMetadata
          ? //@ts-ignore
            this.customSelectionMetadata
          : "",
      });
      const localStorageSubmissionMetadata = JSON.stringify(
        this.submitSelections
      );
      localStorage.setItem(
        "SubmissionMetaData",
        localStorageSubmissionMetadata
      );
      console.log(this.submitSelections);
    },
  },
  watch: {
    customSelection: {
      handler() {
        this.getHighlightedSelectionMetadata();
      },
      deep: false, // Use deep watch if customSelection is an object or array
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
  transform: translateX(-100%);
  opacity: 0;
}

.slide-leave, .slide-enter-to /* .slide-enter-active in <2.1.8 */ {
  transform: translateX(0);
  opacity: 1;
}

::-webkit-scrollbar {
  width: 0; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}
/* Optional: show position indicator in red */
::-webkit-scrollbar-thumb {
  background: #002022;
}

/* WebKit-based browsers (Chrome, Safari, etc.) */
/* Customize the scrollbar track */
::-webkit-scrollbar {
  width: 10px; /* width of the scrollbar */
}

::-webkit-scrollbar-track {
  background: #111115; /* color of the track */
}

/* Customize the scrollbar thumb (the draggable part) */
::-webkit-scrollbar-thumb {
  background: #888; /* color of the thumb */
  border-radius: 5px; /* roundness of the thumb */
}

/* Firefox */
/* Customize scrollbar width and color */
/* Note: Firefox currently does not support styling individual parts like WebKit */
/* You can only set the width and color of the scrollbar */
div {
  scrollbar-width: thin; /* "auto" or "thin" */
  scrollbar-color: #ff8400 #111115; /* thumb color and track color */
}
</style>
