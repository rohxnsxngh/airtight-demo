<template>
  <div>
    <!-- Transition wrapper for the side drawer -->
    <transition name="slide">
      <div
        v-if="showSideDrawer"
        id="collapsible-card"
        class="h-4/5 w-72 bg-base-100 shadow-xl fixed right-0 border border-amber-500"
      >
        <div
          class="btn btn-sm absolute -left-8 top-1 border border-amber-500"
          @click="toggleShowSideDrawer"
        >
          <span class="material-symbols-outlined"> keyboard_arrow_right </span>
        </div>
        <div class="card-body">
          <div class="text-lg font-medium text-white">
            <span class="material-symbols-outlined mx-2"> category </span
            >Properties
          </div>
          <div class="divider"></div>
        </div>
      </div>
    </transition>

    <transition name="slide">
      <div
        v-if="showInsightsDrawer"
        id="collapsible-card"
        class="h-4/5 w-[97%] bg-base-100 shadow-xl fixed right-0 border border-amber-500"
      >
        <div
          class="btn btn-sm absolute -left-8 top-1 border border-amber-500"
          @click="toggleshowInsightsDrawer"
        >
          <span class="material-symbols-outlined"> keyboard_arrow_right </span>
        </div>
        <div class="card-body">
          <div class="text-lg font-medium text-white">
            <span class="material-symbols-outlined mx-2"> key_visualizer </span
            >Insights
          </div>
          <div class="divider"></div>
          <div class="grid grid-cols-3 gap-4 w-full">
            <div class="border border-amber-500 bg-[#242A32] h-[150px] p-2">
              <div class="text-white text-xl font-medium">Budget Remaining</div>
              <div class="indicator ml-44">
                <span
                  class="indicator-item badge -right-10 top-6 text-green-300 border border-green-500"
                  >^5.28%</span
                >

                <div class="text-4xl font-bold text-white mt-6 text-center">
                  $7,293,816
                </div>
              </div>
            </div>
            <div class="border border-amber-500 bg-[#242A32] p-2">
              <div class="text-white text-xl font-medium">Progress</div>
              <div class="text-4xl font-bold text-white mt-6 text-center">
                56%
              </div>
              <progress
                class="progress progress-success w-full mt-6"
                value="56"
                max="100"
              ></progress>
            </div>
            <div class="border border-amber-500 bg-[#242A32] p-2">
              <div class="text-white text-xl font-medium">
                Upcoming Shipments
              </div>
              <div class="text-4xl font-bold text-white mt-6 text-center">
                6
              </div>
              <div class="text-xs font-thin mt-6 italics text-right mr-2">
                Est. Tuesday
              </div>
            </div>
            <div
              class="col-span-2 border border-amber-500 bg-[#242A32] h-[400px] p-2"
            >
              <div class="text-white text-xl font-medium mb-6">Expenditure</div>
              <div class="flex">
                <div class="w-1/2"><StackedBarChart /></div>
                <div class="divider divider-horizontal h-72"></div>
                <div class="w-1/2"><PieChart /></div>
              </div>
            </div>
            <div class="border border-amber-500 bg-[#242A32] p-2">
              <div class="text-white text-xl font-medium">Incidents</div>
              <div class="p-2">
                <div class="h-1/4 bg-[#1B2026] w-full p-2 my-3 rounded-lg">
                  <div class="text-xl font-semibold text-white">
                    Shipment Delay
                    <span
                      class="material-symbols-outlined float-right text-white"
                    >
                      chevron_right
                    </span>
                  </div>
                  <span
                    class="label-text-alt text-xs text-[#6E57FF] font-medium"
                    >Procurement
                    <span class="float-right text-slate-400 mt-1 font-light">
                      17 minutes ago
                    </span></span
                  >
                </div>
                <div class="h-1/4 bg-[#1B2026] w-full p-2 my-3 rounded-lg">
                  <div class="text-xl font-semibold text-white">
                    Invoice Pending
                    <span
                      class="material-symbols-outlined float-right text-white"
                    >
                      chevron_right
                    </span>
                  </div>
                  <span
                    class="label-text-alt text-xs text-[#FF5789] font-medium"
                    >Expenses<span
                      class="float-right text-slate-400 mt-1 font-light"
                    >
                      3 hours ago
                    </span></span
                  >
                </div>
                <div class="h-1/4 bg-[#1B2026] w-full p-2 my-3 rounded-lg">
                  <div class="text-xl font-semibold text-white">
                    Price Reduction
                    <span
                      class="material-symbols-outlined float-right text-white"
                    >
                      chevron_right
                    </span>
                  </div>
                  <span
                    class="label-text-alt text-xs text-[#6E57FF] font-medium"
                    >Procurement<span
                      class="float-right text-slate-400 mt-1 font-light"
                    >
                      3 hours ago
                    </span></span
                  >
                </div>
                <div class="h-1/4 bg-[#1B2026] w-full p-2 my-3 rounded-lg">
                  <div class="text-xl font-semibold text-white">
                    Flag Raised
                    <span
                      class="material-symbols-outlined float-right text-white"
                    >
                      chevron_right
                    </span>
                  </div>
                  <span
                    class="label-text-alt text-xs text-[#6AD361] font-medium"
                    >Auditing<span
                      class="float-right text-slate-400 mt-1 font-light"
                    >
                      1 day ago
                    </span></span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="slide">
      <div
        v-if="showCalendarDrawer"
        id="collapsible-card"
        class="h-fit w-[1000px] bg-base-100 shadow-xl fixed right-0 border border-amber-500"
      >
        <div
          class="btn btn-sm absolute -left-8 top-1 border border-amber-500"
          @click="toggleCalendarDrawer"
        >
          <span class="material-symbols-outlined"> keyboard_arrow_right </span>
        </div>
        <div class="card-body">
          <div class="text-lg font-medium text-white">
            <span class="material-symbols-outlined mx-2"> calendar_month </span
            >Schedule
          </div>
          <div class="divider"></div>
          <Calendar />
        </div>
      </div>
    </transition>

    <transition name="slide">
      <div
        v-if="showSharingDrawer"
        id="collapsible-card"
        class="h-fit w-[1000px] bg-base-100 shadow-xl fixed right-0 border border-amber-500"
      >
        <div
          class="btn btn-sm absolute -left-8 top-1 border border-amber-500"
          @click="toggleSharingDrawer"
        >
          <span class="material-symbols-outlined"> keyboard_arrow_right </span>
        </div>
        <div class="card-body">
          <div class="text-lg font-medium text-white">
            <span class="material-symbols-outlined mx-2"> send </span>Share View
          </div>
          <div class="divider"></div>
          <h2 class="text-md font-thin my-2 px-2">
            Only individuals in your organization will have access to this link.
            <span class="badge badge-sm border border-success float-right"
              >IMPORTANT</span
            >
          </h2>
          <div class="join">
            <input
              class="input input-bordered join-item w-full"
              placeholder="https://airtight.com/model/45ace663-cf7c-4225-9080-865c6ecdd705/"
            />
            <button class="btn join-item border border-amber-300">
              <span class="material-symbols-outlined mx-2"> content_copy </span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Transition wrapper for the collapse button -->
    <transition name="slide">
      <div
        v-if="
          !showSideDrawer &&
          !showInsightsDrawer &&
          !showCalendarDrawer &&
          !showSharingDrawer
        "
        class="fixed right-0"
      >
        <div
          class="btn btn-sm absolute -left-16 top-[4rem] border border-amber-500 tooltip tooltip-left"
          data-tip="properties"
          @click="toggleShowSideDrawer"
        >
          <span class="material-symbols-outlined mt-0.5 hover:text-white">
            keyboard_arrow_left
          </span>
        </div>
      </div>
    </transition>

    <div
      v-if="
        !showSideDrawer &&
        !showInsightsDrawer &&
        !showCalendarDrawer &&
        !showSharingDrawer
      "
      class="fixed right-0"
    >
      <div
        class="btn btn-sm border-none h-fit absolute -left-32 top-1 bg-transparent"
      >
        <img class="w-32" src="/Airtight.svg" />
      </div>
    </div>

    <div
      v-if="
        !showSideDrawer &&
        !showInsightsDrawer &&
        !showCalendarDrawer &&
        !showSharingDrawer
      "
      class="fixed right-0"
    >
      <div
        class="btn btn-sm absolute -left-48 top-1 border border-amber-500 tooltip tooltip-left"
        data-tip="share"
        @click="toggleSharingDrawer"
      >
        <span class="material-symbols-outlined mt-0.5 hover:text-white">
          share
        </span>
      </div>
    </div>

    <div
      v-if="
        !showSideDrawer &&
        !showInsightsDrawer &&
        !showCalendarDrawer &&
        !showSharingDrawer
      "
      class="fixed right-0"
    >
      <div
        class="btn btn-sm absolute -left-16 top-[7rem] border border-amber-500 tooltip tooltip-left"
        data-tip="settings"
        @click="toggleShowSideDrawer"
      >
        <span class="material-symbols-outlined mt-0.5 hover:text-white">
          settings
        </span>
      </div>
    </div>

    <div
      v-if="
        !showSideDrawer &&
        !showInsightsDrawer &&
        !showCalendarDrawer &&
        !showSharingDrawer
      "
      class="fixed right-0"
    >
      <div
        class="btn btn-sm absolute -left-16 top-[10rem] border border-amber-500 tooltip tooltip-left"
        data-tip="insights"
        @click="toggleshowInsightsDrawer"
      >
        <span class="material-symbols-outlined mt-0.5 hover:text-white">
          local_fire_department
        </span>
      </div>
    </div>

    <div
      v-if="
        !showSideDrawer &&
        !showInsightsDrawer &&
        !showCalendarDrawer &&
        !showSharingDrawer
      "
      class="fixed right-0"
    >
      <div
        class="btn btn-sm absolute -left-16 top-[13rem] border border-amber-500 tooltip tooltip-left"
        data-tip="manage permission"
        @click="toggleshowInsightsDrawer"
      >
        <span class="material-symbols-outlined mt-0.5 hover:text-white">
          group
        </span>
      </div>
    </div>

    <div
      v-if="
        !showSideDrawer &&
        !showInsightsDrawer &&
        !showCalendarDrawer &&
        !showSharingDrawer
      "
      class="fixed right-0"
    >
      <div
        class="btn btn-sm absolute -left-16 top-[16rem] border border-amber-500 tooltip tooltip-left"
        data-tip="schedule"
        @click="toggleCalendarDrawer"
      >
        <span class="material-symbols-outlined mt-0.5 hover:text-white">
          event
        </span>
      </div>
    </div>

    <div
      v-if="
        !showSideDrawer &&
        !showInsightsDrawer &&
        !showCalendarDrawer &&
        !showSharingDrawer
      "
      class="fixed right-0"
    >
      <div
        class="btn btn-sm absolute -left-16 top-[19rem] border border-amber-500 tooltip tooltip-left"
        data-tip="budget"
        @click="toggleshowInsightsDrawer"
      >
        <span class="material-symbols-outlined mt-0.5 hover:text-white">
          account_balance
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Calendar from "./Calendar.vue";
import StackedBarChart from "./StackedBarChart.vue";
import PieChart from "./PieChart.vue";

export default {
  data() {
    return {
      showSideDrawer: false,
      showInsightsDrawer: false,
      showCalendarDrawer: false,
      showSharingDrawer: false,
    };
  },
  components: {
    Calendar,
    StackedBarChart,
    PieChart,
  },
  methods: {
    toggleShowSideDrawer() {
      this.showSideDrawer = !this.showSideDrawer;
    },
    toggleshowInsightsDrawer() {
      this.showInsightsDrawer = !this.showInsightsDrawer;
    },
    toggleCalendarDrawer() {
      this.showCalendarDrawer = !this.showCalendarDrawer;
    },
    toggleSharingDrawer() {
      this.showSharingDrawer = !this.showSharingDrawer;
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
