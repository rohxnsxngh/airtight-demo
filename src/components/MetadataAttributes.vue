<template>
  <div>
    <div v-for="(c, index) in classes" :key="index" class="ml-4 my-4 flex">
      <div class="collapse bg-base-300">
        <input type="checkbox" />
        <div class="collapse-title text-xs font-medium h-fit">
          {{ c.class }}
          <span
            v-if="c.metadata.length > 0"
            class="text-white badge badge-xs font-thin float-right mr-2 mt-1 ring-1 ring-amber-300"
            >{{ c.metadata.length }}</span
          >
        </div>
        <div class="collapse-content">
          <div
            v-for="(metadata, metaDataIndex) in c.metadata"
            :key="metaDataIndex"
          >
            <Visibility class="-left-4 top-10 z-10" />
            <details class="collapse bg-base-200 my-2">
              <summary class="collapse-title text-xs font-medium">
                {{ metadata.Name }}
              </summary>
              <div class="collapse-content">
                <div
                  v-for="metadataAttributes in metadata.attributes"
                  :key="metadataAttributes.Name"
                >
                  <details class="collapse bg-base-300 my-2">
                    <summary class="collapse-title text-xs font-medium">
                      {{ metadataAttributes.Name }}
                    </summary>
                    <div class="collapse-content">
                      <!-- Conditionally render based on the name -->
                      <div v-if="metadataAttributes.Name === 'Attributes'">
                        <p>Class: {{ metadataAttributes.attributes.Class }}</p>
                        <p>
                          GlobalId: {{ metadataAttributes.attributes.GlobalId }}
                        </p>
                        <p>Name: {{ metadataAttributes.attributes.Name }}</p>
                        <p>
                          OverallHeight:
                          {{ metadataAttributes.attributes.OverallHeight }}
                        </p>
                        <p>
                          OverallWidth:
                          {{ metadataAttributes.attributes.OverallWidth }}
                        </p>
                        <p>
                          ObjectType:
                          {{ metadataAttributes.attributes.ObjectType }}
                        </p>
                        <p>Tag: {{ metadataAttributes.attributes.Tag }}</p>
                        <div
                          v-for="material in metadataAttributes.attributes
                            .Materials"
                          :key="material.Name"
                        >
                          <p>Material Name: {{ material.Name }}</p>
                        </div>
                        <div
                          v-for="property in metadataAttributes.attributes
                            .Properties"
                          :key="
                            //@ts-ignore
                            property.Name
                          "
                        >
                          <p>
                            Property Name:
                            {{
                              //@ts-ignore
                              property.Name
                            }}
                          </p>
                          <div
                            v-for="//@ts-ignore
                            propertySet in property.propertySets"
                            :key="propertySet.Reference"
                          >
                            <p>
                              Property Set Reference:
                              {{ propertySet.Reference }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        v-else-if="metadataAttributes.Name === 'Property Sets'"
                      >
                        <div
                          v-for="propertySet in metadataAttributes.propertySets"
                          :key="propertySet.Name"
                        >
                          <p>Property Set Name: {{ propertySet.Name }}</p>
                          <p>
                            Reference: {{ propertySet.properties.Reference }}
                          </p>
                        </div>
                      </div>
                      <div v-else-if="metadataAttributes.Name === 'Materials'">
                        <div
                          v-for="material in metadataAttributes.materials"
                          :key="material.Name"
                        >
                          <p>Material Name: {{ material.Name }}</p>
                        </div>
                      </div>
                      <div v-else>
                        <!-- Handle unknown types -->
                        <p>
                          Unknown attribute type:
                          {{
                            //@ts-ignore
                            metadataAttributes.Name
                          }}
                        </p>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
      <Visibility />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Metadata } from "../interfaces/model";
import Visibility from "./Visibility.vue";

interface ClassOrganizationItem {
  class: string;
  id: string;
  metadata: Metadata[];
}

export default defineComponent({
  name: "MetadataAttributes",
  components: {
    Visibility,
  },
  props: {
    classes: {
      type: Array as PropType<ClassOrganizationItem[]>,
      required: true,
    },
  },
});
</script>
