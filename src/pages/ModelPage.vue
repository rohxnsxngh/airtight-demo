<template>
  <div id="container" class="flex flex-row"></div>
  <div class="flex flex-row">
    <div>
      <Drawer
        :uploadIFC="uploadIFC"
        :classes="classOrganization"
        :spatial="spatialStructuresOrganization"
        :modelData="modelData"
        :deleteIFC="disposeModelbyUUID"
        :customSelection="customSelectedFragments"
        :getHighlightedFragmentsMetadata="getHighlightedFragmentsMetadata"
      />
    </div>
    <div>
      <SideDrawer />
    </div>

    <div>
      <BottomDrawer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
//@ts-ignore
import * as CUI from "@thatopen/ui-obc";

// import * as path from "path";
import * as WEBIFC from "web-ifc";
import * as OBCF from "@thatopen/components-front";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createGrid } from "../utilities/grid.ts";
import { IFCManager } from "../utilities/ifcmanager.ts";
import { ref } from "vue";
import {
  CustomSelectedFragment,
  IModelMetaData,
  Metadata,
} from "../interfaces/model.ts";
import { createLighting } from "../utilities/lighting.ts";
import * as FRAGS from "@thatopen/fragments";

BUI.Manager.init();

const classOrganization = ref<
  {
    class: string;
    id: string;
    entitymap: FRAGS.FragmentIdMap;
    metadata: Metadata[];
  }[]
>([]);
const spatialStructuresOrganization = ref<{ structure: string; id: string }[]>(
  []
);
// const customSelectedFragments = ref<CustomSelectedFragment[]>([]);
const customSelectedFragments = ref<FRAGS.FragmentIdMap>();
// Reactive state

// Define the reactive modelData object

// Assuming the interface is defined above
const modelData = ref<IModelMetaData[]>([]);
const modelUUIDs = ref(new Set());

const components = new OBC.Components();
const worlds = components.get(OBC.Worlds);
const world = worlds.create<
  OBC.SimpleScene,
  OBC.SimpleCamera,
  // OBCF.PostproductionRenderer
  OBC.SimpleRenderer
>();
let viewport: any;

// fragments setup
const fragments = components.get(OBC.FragmentsManager);
const fragmentIfcLoader = components.get(OBC.IfcLoader);
fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = false;
fragmentIfcLoader.settings.webIfc.OPTIMIZE_PROFILES = true;
fragmentIfcLoader.setup();

// Instantiate IFCManager
const ifcManager = new IFCManager(components, world);

// Culler
const cullers = components.get(OBC.Cullers);

// Hider
const hider = components.get(OBC.Hider);

//Exploder
const exploder = components.get(OBC.Exploder);

// Create the fragmentIdMap
const fragmentIdMap: FRAGS.FragmentIdMap = {};

// Classifier
const classifier = components.get(OBC.Classifier);

// Disposer
const disposer = components.get(OBC.Disposer);

//Bounding Box
const fragmentBbox = components.get(OBC.BoundingBoxer);

// Highlighter
const highlighter = components.get(OBCF.Highlighter);
// highlighter.colors.set("selectionHighlight", new THREE.Color(0x0000ff)); // Blue color

// Indexer - IFC Relations Index
const indexer = components.get(OBC.IfcRelationsIndexer);

// const edges = components.get(OBCF.ClipEdges);
// clipper.Type = OBCF.EdgesPlane;

function render() {
  viewport = document.getElementById("container")!;

  world.scene = new OBC.SimpleScene(components);
  // world.renderer = new OBCF.PostproductionRenderer(components, viewport);
  world.renderer = new OBC.SimpleRenderer(components, viewport);
  world.camera = new OBC.OrthoPerspectiveCamera(components);

  // world.renderer.postproduction.enabled = true;
  // world.renderer.postproduction.customEffects.outlineEnabled = true;

  console.log(world);

  // const [worldsTable] = CUI.tables.worldsConfiguration({ components });
  // console.log("WORLD TABLE", worldsTable._filteredData);

  createLighting(world.scene.three);

  // const culler = cullers.create(world);
  // culler.threshold = 200;

  // culler.needsUpdate = true;
  // world.camera.controls.addEventListener("controlend", () => {
  //   culler.needsUpdate = true;
  // });

  const casters = components.get(OBC.Raycasters);
  casters.get(world);
  const clipper = components.get(OBC.Clipper);
  clipper.enabled = false;

  // Orbit Controls
  const controls = new OrbitControls(
    // @ts-ignore
    world.camera.three,
    // @ts-ignore
    world.renderer.three.domElement
  );

  // Obit Controls Gizmo
  const viewHelper = new OrbitViewHelper(
    controls,
    { size: 100, padding: 8 },
    components
  );

  // Add the Gizmo to the document
  viewHelper.domElement.style.pointerEvents = "none";
  document.body.appendChild(viewHelper.domElement);

  highlighter.setup({ world });
  highlighter.zoomToSelection = true;

  components.init();
  world.scene.three.background = null;
  world.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);
  // // all functions and methods go below here
  createGrid(components, world);

  // const axesHelper = new THREE.AxesHelper(3);
  // world.scene.three.add(axesHelper);

  // const orbitMode = new OBC.OrbitMode(world.camera.three)

  const angles = components.get(OBCF.AngleMeasurement);
  angles.world = world;
  angles.enabled = false;

  world.scene.setup();

  observeElementAndAddEventListener("angles", "change", () => {
    //@ts-ignore
    if (event.target && event.target.type === "checkbox") {
      //@ts-ignore
      if (event.target.checked === true) {
        highlighter.enabled = false;
        angles.enabled = true;

        console.log(FragmentGroup);

        viewport.ondblclick = () => angles.create();

        window.onkeydown = (event) => {
          if (event.code === "Delete" || event.code === "Backspace") {
            angles.deleteAll();
          }
        };
      } else {
        angles.deleteAll();
        highlighter.enabled = true;
        angles.enabled = false;
      }
    }
  });

  observeElementAndAddEventListener("clippers", "change", () => {
    //@ts-ignore
    if (event.target && event.target.type === "checkbox") {
      //@ts-ignore
      if (event.target.checked === true) {
        clipper.enabled = true;
        highlighter.enabled = false;

        console.log(FragmentGroup);

        viewport.ondblclick = () => clipper.create(world);

        clipper.onBeforeDrag.add(() => {
          world.camera.controls.enabled = true;
          world.camera.controls.azimuthRotateSpeed = 0;
          console.log("Clipping plane dragged");
        });

        clipper.onAfterDrag.add(() => {
          world.camera.controls.enabled = true;
          world.camera.controls.azimuthRotateSpeed = 1;
          console.log("Clipping plane dragged");
        });

        window.onkeydown = (event) => {
          if (event.code === "Delete" || event.code === "Backspace") {
            clipper.delete(world);
          }
        };
      } else {
        clipper.deleteAll();
        highlighter.enabled = true;
        clipper.enabled = false;
      }
    }
  });
}

let modelMetaData;
let FragmentGroup: FRAGS.FragmentsGroup;
let entityGroup: FRAGS.FragmentIdMap[] = [];
function uploadIFC() {
  const fileInput = document.getElementById("fileInput") as HTMLInputElement;
  fileInput.click();
  ifcManager.setupUploadHandler(fileInput, components);
  fragments.onFragmentsLoaded.add(async (model) => {
    fragmentBbox.add(model);
    // This creates a classification system named "entities"
    const classify = ifcManager.setupClassifier(model, WEBIFC, components);

    await indexer.process(model);

    const [_classes, _spatialStructures, classNames, structureNames] =
      await ifcManager.readIFCClasses(classify);

    console.warn("CLASSNAME AND STRUCTURE NAMES", classNames, structureNames);

    highlighter.events.select.onHighlight.add(async (fragmentIdMap) => {
      console.log(fragmentIdMap);
      // Extract the UUID key from fragmentIdMap
      const fragmentId = Object.keys(fragmentIdMap)[0]; // Assuming there's only one key

      customSelectedFragments.value = {
        ...customSelectedFragments.value,
        ...fragmentIdMap,
      };

      console.warn(
        "Updated customSelectedFragments",
        customSelectedFragments.value
      );
    });

    highlighter.events.select.onClear.add(async (fragmentIdMap) => {
      customSelectedFragments.value = {};
    });

    // Fetch and log details for each class
    for (const className of Array.isArray(classNames) ? classNames : []) {
      const entities = (await classifier).list.entities[className];
      console.log(`Details for class: ${className}`);
      console.log(entities);
      entityGroup.push(entities);

      const data = await computeTableData(components, entities);
      console.warn("DATA", data);

      // Push data into classOrganization using the ComplexObject interface
      classOrganization.value.push({
        class: className,
        id: model.uuid,
        entitymap: entities,
        metadata: data as unknown as Metadata[],
      });

      console.error(classOrganization);

      for (const key in entities) {
        if (entities.hasOwnProperty(key)) {
          const expressIDs = entities[key];
          for (const expressID of expressIDs) {
            // console.log(expressID);
          }
        }
      }
    }

    // Fetch and log details for each spatialStructure
    for (const StructureName of Array.isArray(structureNames)
      ? structureNames
      : []) {
      // const entities = (await classifier).list.entities[StructureName];
      spatialStructuresOrganization.value.push({
        structure: StructureName,
        id: model.uuid,
      });
    }

    modelMetaData = {
      name: model.name,
      uuid: model.uuid,
      schema: model.ifcMetadata.schema,
      //@ts-ignore
      viewDefinition: model.ifcMetadata.viewDefinition,
    };

    FragmentGroup = model;

    for (const mesh of FragmentGroup.children) {
      console.log(mesh);
      //@ts-ignore
      world.meshes.add(mesh);
    }

    // Check for duplicate UUID before adding the new model
    if (!modelUUIDs.value.has(model.uuid)) {
      modelUUIDs.value.add(modelMetaData.uuid);
      modelData.value.push(modelMetaData); // Add the new model to the array
    } else {
      console.warn("Duplicate model UUID detected: ", modelMetaData.uuid);
    }
  });
}

observeElementAndAddEventListener("ifc-explode", "change", (event) => {
  // Ensure event.target is an input element with a checked property
  //@ts-ignore
  if (event.target && event.target.type === "checkbox") {
    //@ts-ignore
    console.log(event.target.checked);
    //@ts-ignore
    exploder.set(event.target.checked);
  }
});

// observeElementAndAddEventListener("custom-selections", "change", (event) => {
//   //@ts-ignore
//   if (event.target && event.target.type === "checkbox") {
//     //@ts-ignore
//     console.log(event.target.checked);
//     // @ts-ignore
//     if (event.target.checked === true) {
//       document.body.style.cursor = "crosshair";
//       highlighter.events.select.onHighlight.add(async (fragmentIdMap) => {
//         // Extract the UUID key from fragmentIdMap
//         const fragmentId = Object.keys(fragmentIdMap)[0]; // Assuming there's only one key

//         // Check if the fragmentId is already in customSelectedFragments.value
//         const isFragmentIdAlreadySelected = customSelectedFragments.value.some(
//           (item) => {
//             return Object.keys(item)[0] === fragmentId;
//           }
//         );

//         if (!isFragmentIdAlreadySelected) {
//           const data = await computeTableData(components, fragmentIdMap);
//           console.warn("DATA", data);
//           const customFrag = { id: data[0].Name, fragmentMap: fragmentIdMap };
//           customSelectedFragments.value.push(customFrag);
//           console.warn("Fragment ID Map", fragmentIdMap);
//         } else {
//           console.warn(`Fragment ID ${fragmentId} is already selected.`);
//         }
//       });
//       // Assuming fragmentIdMap has a property 'id' that serves as a unique identifier
//       customSelectedFragments.value.forEach(async (fragmentIdMap) => {
//         // Extract the identifier/name from fragmentIdMap
//         // console.warn("Fragment ID Map", Object.keys(fragmentIdMap));
//         highlighter.colors.set("customSelection", new THREE.Color(0x0000ff)); // Blue color
//         highlighter.highlight(
//           "customSelection",
//           false,
//           true,
//           fragmentIdMap.fragmentMap
//         );
//       });
//     } else {
//       document.body.style.cursor = "auto";
//     }
//   }
// });

async function getHighlightedFragmentsMetadata(customFragments: any) {
  const data = await computeTableData(components, customFragments);
  console.warn("DATA FROM HIGHLIGHTED FRAGS", data);
  return data
}

observeElementAndAddEventListener("ifc-hider", "change", (event) => {
  // Ensure event.target is an input element with a checked property
  //@ts-ignore
  if (event.target && event.target.type === "checkbox") {
    //@ts-ignore
    console.log(event.target.checked);
    // Iterate through the array
    for (let i = 0; i < entityGroup.length; i++) {
      const obj = entityGroup[i];
      console.log(obj);
      //@ts-ignore
      hider.set(event.target.checked, obj);
    }
  }
});

observeElementAndAddEventListener("fit-model-view", "mousedown", () => {
  const bbox = fragmentBbox.getMesh();
  world.camera.controls.fitToSphere(bbox, true);
  // fragmentBbox.reset();
});

function disposeModelbyUUID(modelName: any, modelID: any) {
  console.log("deleting model");
  const model = world.scene.three.getObjectByProperty("uuid", modelID);
  console.log(model);
  if (model) {
    console.log(FragmentGroup);
    fragments.disposeGroup(FragmentGroup);
    // disposer.destroy(model);

    // Remove the ID from the set
    modelUUIDs.value.delete(modelID);

    // Find and remove the model from the array
    modelData.value = modelData.value.filter((m) => m.uuid !== modelID);

    spatialStructuresOrganization.value =
      spatialStructuresOrganization.value.filter((item) => item.id !== modelID);
    classOrganization.value = classOrganization.value.filter(
      (item) => item.id !== modelID
    );

    console.log("Model removed:", modelName, model.uuid, modelData.value);
  }
}

onMounted(() => {
  render();
});
</script>

<script lang="ts">
import Drawer from "../components/Drawer.vue";
import { OrbitViewHelper } from "../utilities/orbit.ts";
import SideDrawer from "../components/SideDrawer.vue";
import BottomDrawer from "../components/BottomDrawer.vue";
import { computeTableData } from "../utilities/elementProperties.ts";
import { observeElementAndAddEventListener } from "../utilities/helper.ts";

export default {
  components: {
    Drawer,
    SideDrawer,
    BottomDrawer,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  top: 0;
  position: fixed;
  overflow: hidden;
}
</style>
