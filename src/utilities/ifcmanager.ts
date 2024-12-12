import * as OBC from "@thatopen/components";
// import * as WEBIFC from "web-ifc";

export class IFCManager {
  fragments: OBC.FragmentsManager;
  world: OBC.World;
  uuid: string;
  constructor(components: OBC.Components, world: OBC.World) {
    // @ts-ignore
    this.fragments = components.get(OBC.IfcLoader);
    this.world = world;
    this.uuid = "";
  }

  async loadFragmentsFromFile(file: any) {
    if (!this.fragments || !this.fragments.groups) {
      console.warn("Fragments manager or groups are not yet available.");
      return;
    }

    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const group = this.fragments.load(buffer);
    this.world.scene.three.add(group);
    this.uuid = group.uuid;
  }

  async loadFragmentsFromURL(url: any) {
    if (!this.fragments || !this.fragments.groups) {
      console.warn("Fragments manager or groups are not yet available.");
      return;
    }

    try {
      const file = await fetch(url);
      const data = await file.arrayBuffer();
      const buffer = new Uint8Array(data);
      const group = this.fragments.load(buffer);
      this.world.scene.three.add(group);
      this.uuid = group.uuid;
    } catch (error) {
      console.error("Failed to load fragments from URL:", error);
    }
  }

  async loadIfc() {
    const file = await fetch(
      "https://thatopen.github.io/engine_components/resources/small.ifc"
    );
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const model = await this.fragments.load(buffer);
    model.name = "example";
    this.world.scene.three.add(model);
  }

  // Function to handle file upload
  async handleFileUpload(file: File, components: OBC.Components) {
    if (file) {
      const ifcLoader = components.get(OBC.IfcLoader);
      await ifcLoader.setup();
      console.log(`File uploaded: ${file.name}`);
      const data = await file.arrayBuffer();
      const buffer = new Uint8Array(data);
      // const model = await this.fragments.load(buffer);
      const model = await ifcLoader.load(buffer);
      model.name = file.name.split(".")[0];
      this.world.scene.three.add(model);
      console.error("MODEL LOADED", model)
    } else {
      console.error("No file selected");
    }
  }

  download(file: any) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  exportFragments() {
    if (!this.fragments.groups.size) {
      return;
    }
    const group = this.fragments.groups.get(this.uuid);
    if (!group) {
      return;
    }
    const data = this.fragments.export(group);
    const blob = new Blob([data]);
    const file = new File([blob], "small.frag");
    this.download(file);
  }

  disposeFragments() {
    this.fragments.dispose();
  }

  disposeFragmentsbyUUID(modelID: string) {
    const model = this.fragments.groups.get(modelID);
    console.error(model);
    // if (model) {
    //   console.warn("deleting model")
    //   this.fragments.disposeGroup(model);
    // }
  }

  async readIFCClasses(classify: any) {
    const spatialStructures: Record<string, any> = {};
    const structureNames = Object.keys((await classify).list.spatialStructures);
    for (const name of structureNames) {
      spatialStructures[name] = true;
    }

    const classes: Record<string, any> = {};
    const classNames = Object.keys((await classify).list.entities);
    for (const name of classNames) {
      classes[name] = true;
    }

    console.log("Spatial Structures:", spatialStructures);
    console.log("Classes:", classes);

    return [classes, spatialStructures, classNames, structureNames];
  }

  async ifcAnalysis(
    classifier: OBC.Classifier,
    model: any,
    components: OBC.Components
  ) {
    const classes: Record<string, any> = {};
    const classNames = Object.keys((await classifier).list.entities);
    for (const name of classNames) {
      classes[name] = true;
    }
    console.log("Classes:", classes);
    const classify = components.get(OBC.Classifier);

    // Fetch and log details for each class
    for (const className of classNames) {
      const entities = (await classifier).list.entities[className];
      console.log(`Details for class: ${className}`);
      // console.log(entities);
      classify.byEntity(model);

      const entityRelations = classifier.find({
        entities: [className],
      });

      console.log("Class Name Entities", className, entityRelations);

      for (const expressID in entities) {
        if (entities.hasOwnProperty(expressID)) {
          const valueSet = entities[expressID];
          // console.log(`Key: ${expressID}`);
          valueSet.forEach(async (value: any) => {
            console.log(`Value: ${value}`);
          });
        }
      }
    }
  }

  async setupClassifier(model: any, WEBIFC: any, components: OBC.Components) {
    const classifier = components.get(OBC.Classifier);
    classifier.byIfcRel(
      model,
      WEBIFC.IFCRELCONTAINEDINSPATIALSTRUCTURE,
      "storeys"
    );

    const properties = fetch(
      "https://thatopen.github.io/engine_components/resources/small.json"
    );
    model.setLocalProperties(await (await properties).json());

    const indexer = components.get(OBC.IfcRelationsIndexer);
    const relationsFile = await fetch(
      "https://thatopen.github.io/engine_components/resources/small-relations.json"
    );
    const relations = indexer.getRelationsMapFromJSON(
      await relationsFile.text()
    );
    indexer.setRelationMap(model, relations);

    classifier.byEntity(model);
    await classifier.bySpatialStructure(model);

    return classifier;
  }

  setupUploadHandler(inputElement: {
    addEventListener: (
      arg0: string,
      arg1: (event: any) => Promise<void>
    ) => void;
  }, components: OBC.Components) {
    inputElement.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      this.handleFileUpload(file, components);
    });
  }
}

export default IFCManager;
