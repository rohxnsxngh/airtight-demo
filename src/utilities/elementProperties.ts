import * as FRAGS from "@thatopen/fragments";
import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as WEBIFC from "web-ifc";

export interface ElementPropertiesUIState {
  components: OBC.Components;
  fragmentIdMap: FRAGS.FragmentIdMap;
}

type AttributesRow = {
  Name: string;
  attributes: Record<string, any>;
};

type SetRowProperties = {
  [key: string]: any;
};

const attrsToIgnore = ["OwnerHistory", "ObjectPlacement", "CompositionType"];

const getAttributesRow = async (
  model: FRAGS.FragmentsGroup,
  expressID: number,
  _options?: {
    groupName?: string;
    includeClass?: boolean;
  }
) => {
  const defaultOptions = {
    groupName: "Attributes",
    includeClass: false,
  };
  const options = { ...defaultOptions, ..._options };
  const { groupName, includeClass } = options;

  const elementAttrs = (await model.getProperties(expressID)) ?? {};
  const attrsRow: AttributesRow = { Name: groupName, attributes: {} };

  if (includeClass) {
    attrsRow.attributes["Class"] = OBC.IfcCategoryMap[elementAttrs.type];
  }

  for (const attrName in elementAttrs) {
    if (attrsToIgnore.includes(attrName)) continue;
    const attrValue = elementAttrs[attrName];
    if (!attrValue) continue;
    if (typeof attrValue === "object" && !Array.isArray(attrValue)) {
      if (attrValue.type === WEBIFC.REF) continue;
      attrsRow.attributes[attrName] = attrValue.value;
    }
  }
  return attrsRow;
};

const getPsetRow = async (model: FRAGS.FragmentsGroup, psetIDs: number[]) => {
  const row = { Name: "Property Sets", propertySets: [] };
  for (const psetID of psetIDs) {
    const setAttrs = await model.getProperties(psetID);
    if (!setAttrs) continue;
    const setRow: { Name: string; properties: SetRowProperties } = {
      Name: setAttrs.Name.value,
      properties: {},
    };
    if (setAttrs.type !== WEBIFC.IFCPROPERTYSET) continue;
    for (const propHandle of setAttrs.HasProperties) {
      const { value: propID } = propHandle;
      const propAttrs = await model.getProperties(propID);
      if (!propAttrs) continue;
      const valueKey = Object.keys(propAttrs).find((attr) =>
        attr.includes("Value")
      );
      if (!(valueKey && propAttrs[valueKey])) continue;
      setRow.properties[propAttrs.Name.value] = propAttrs[valueKey].value;
    }
    row.propertySets.push(setRow);
  }
  return row;
};

const getQsetRow = async (model: FRAGS.FragmentsGroup, psetIDs: number[]) => {
  const row = { Name: "Quantity Sets", quantitySets: [] };
  for (const psetID of psetIDs) {
    const setAttrs = await model.getProperties(psetID);
    if (!setAttrs) continue;
    const setRow: { Name: string; quantities: SetRowProperties } = {
      Name: setAttrs.Name.value,
      quantities: {},
    };
    if (setAttrs.type !== WEBIFC.IFCELEMENTQUANTITY) continue;
    for (const qtoHandle of setAttrs.Quantities) {
      const { value: propID } = qtoHandle;
      const propAttrs = await model.getProperties(propID);
      if (!propAttrs) continue;
      const valueKey = Object.keys(propAttrs).find((attr) =>
        attr.includes("Value")
      );
      if (!(valueKey && propAttrs[valueKey])) continue;
      setRow.quantities[propAttrs.Name.value] = propAttrs[valueKey].value;
    }
    row.quantitySets.push(setRow);
  }
  return row;
};

const getMaterialRow = async (
  model: FRAGS.FragmentsGroup,
  materialIDs: number[]
) => {
  const row = { Name: "Materials", materials: [] };
  for (const materialID of materialIDs) {
    const relAttrs = await model.getProperties(materialID);
    if (relAttrs && relAttrs.type === WEBIFC.IFCMATERIALLAYERSETUSAGE) {
      const layerSetID = relAttrs.ForLayerSet.value;
      const layerSetAttrs = await model.getProperties(layerSetID);
      if (!layerSetAttrs) continue;
      for (const layerHandle of layerSetAttrs.MaterialLayers) {
        const { value: layerID } = layerHandle;
        const layerAttrs = await model.getProperties(layerID);
        if (!layerAttrs) continue;
        const materialAttrs = await model.getProperties(
          layerAttrs.Material.value
        );
        if (!materialAttrs) continue;
        const layerRow = {
          Layer: {
            Thickness: layerAttrs.LayerThickness.value,
            Material: materialAttrs.Name.value,
          },
        };
        row.materials.push(layerRow);
      }
    }
    if (relAttrs && relAttrs.type === WEBIFC.IFCMATERIALLIST) {
      for (const materialHandle of relAttrs.Materials) {
        const { value: materialID } = materialHandle;
        const materialAttrs = await model.getProperties(materialID);
        if (!materialAttrs) continue;
        const materialRow = {
          Name: materialAttrs.Name.value,
        };
        row.materials.push(materialRow);
      }
    }
    if (relAttrs && relAttrs.type === WEBIFC.IFCMATERIAL) {
      const materialAttrs = await model.getProperties(materialID);
      if (!materialAttrs) continue;
      const materialRow = {
        Name: materialAttrs.Name.value,
      };
      row.materials.push(materialRow);
    }
  }
  return row;
};

const getClassificationsRow = async (
  model: FRAGS.FragmentsGroup,
  classificationIDs: number[]
) => {
  const row = { Name: "Classifications", classifications: [] };
  for (const classificationID of classificationIDs) {
    const relAttrs = await model.getProperties(classificationID);
    if (relAttrs && relAttrs.type === WEBIFC.IFCCLASSIFICATIONREFERENCE) {
      const { value: sourceID } = relAttrs.ReferencedSource;
      const sourceAttrs = await model.getProperties(sourceID);
      if (!sourceAttrs) continue;
      const classificationRow = {
        Name: sourceAttrs.Name.value,
        details: {
          Identification:
            relAttrs.Identification?.value || relAttrs.ItemReference?.value,
          Name: relAttrs.Name.value,
        },
      };
      row.classifications.push(classificationRow);
    }
  }
  return row;
};

export const computeTableData = async (
  components: OBC.Components,
  fragmentIdMap: FRAGS.FragmentIdMap
) => {
  const indexer = components.get(OBC.IfcRelationsIndexer);
  const fragments = components.get(OBC.FragmentsManager);
  const rows = [];

  const data: any = [];

  const expressIDs = [];

  for (const fragID in fragmentIdMap) {
    const fragment = fragments.list.get(fragID);
    if (!(fragment && fragment.group)) continue;
    const model = fragment.group;
    const existingModel = data.find((value: any) => value.model === model);
    if (existingModel) {
      for (const id of fragmentIdMap[fragID]) {
        (existingModel.expressIDs as Set<number>).add(id);
        expressIDs.push(id);
      }
    } else {
      const info = { model, expressIDs: new Set(fragmentIdMap[fragID]) };
      data.push(info);
    }
  }

  for (const value in data) {
    const { model, expressIDs } = data[value];
    const modelRelations = indexer.relationMaps[model.uuid];
    if (!modelRelations) continue;
    for (const expressID of expressIDs) {
      const elementAttrs = await model.getProperties(expressID);
      if (!elementAttrs) continue;

      const elementRow = {
        Name: elementAttrs.Name?.value,
        attributes: [],
      };

      rows.push(elementRow);

      const attributesRow = await getAttributesRow(model, expressID, {
        includeClass: true,
      });

      elementRow.attributes.push(attributesRow);

      const elementRelations = modelRelations.get(expressID);
      if (!elementRelations) continue;

      const definedByRelations = indexer.getEntityRelations(
        model,
        expressID,
        "IsDefinedBy"
      );

      if (definedByRelations) {
        const psetRels = definedByRelations.filter(async (rel) => {
          const relAttrs = await model.getProperties(rel);
          if (relAttrs) {
            return relAttrs.type === WEBIFC.IFCPROPERTYSET;
          }
          return false;
        });
        const psetRow = await getPsetRow(model, psetRels);
        if (psetRow.propertySets.length) elementRow.attributes.push(psetRow);

        const qsetRels = definedByRelations.filter(async (rel) => {
          const relAttrs = await model.getProperties(rel);
          if (relAttrs) {
            return relAttrs.type === WEBIFC.IFCELEMENTQUANTITY;
          }
          return false;
        });
        const qsetRow = await getQsetRow(model, qsetRels);
        if (qsetRow.quantitySets.length) elementRow.attributes.push(qsetRow);
      }

      const associateRelations = indexer.getEntityRelations(
        model,
        expressID,
        "HasAssociations"
      );

      if (associateRelations) {
        const materialRelations = associateRelations.filter(async (rel) => {
          const relAttrs = await model.getProperties(rel);
          if (relAttrs) {
            return (
              relAttrs.type === WEBIFC.IFCRELASSOCIATESMATERIAL ||
              relAttrs.type === WEBIFC.IFCMATERIAL
            );
          }
          return false;
        });
        const materialRow = await getMaterialRow(model, materialRelations);
        if (materialRow.materials.length)
          elementRow.attributes.push(materialRow);

        const classificationRelations = associateRelations.filter(
          async (rel) => {
            const relAttrs = await model.getProperties(rel);
            if (relAttrs) {
              return relAttrs.type === WEBIFC.IFCRELASSOCIATESCLASSIFICATION;
            }
            return false;
          }
        );
        const classificationRow = await getClassificationsRow(
          model,
          classificationRelations
        );
        if (classificationRow.classifications.length)
          elementRow.attributes.push(classificationRow);
      }
    }
  }

  return rows;
};

// export async function parseIfcFile(
//   components: OBC.Components,
//   fragmentIdMap: FRAGS.FragmentIdMap
// ) {
//   const data = await computeTableData(components, fragmentIdMap);
//   console.error("DATA", data);
// }
