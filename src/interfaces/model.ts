import * as FRAGS from "@thatopen/fragments";

export interface IModelMetaData {
  name: string;
  uuid: string;
  schema: any;
  viewDefinition: any;
}

interface MaterialItem {
  Name: string;
}

interface PropertySetItem {
  Reference: string;
}

interface AttributeItem {
  Class: string;
  GlobalId: string;
  Name: string;
  OverallHeight: number;
  OverallWidth: number;
  ObjectType: string;
  Tag: string;
  Materials: MaterialItem[];
  Properties: PropertySetItem[];
}

interface Attributes {
  Name: 'Attributes';
  attributes: AttributeItem;
}

interface PropertySets {
  Name: 'Property Sets';
  propertySets: {
    Name: string;
    properties: PropertySetItem;
  }[];
}

interface Materials {
  Name: 'Materials';
  materials: MaterialItem[];
}

type MetadataItem = Attributes | PropertySets | Materials;

export interface Metadata {
  Name: string;
  attributes: MetadataItem[];
}

export interface SpatialStructures {
  class: string;
  id: string;
  metadata: Metadata[];
  attributes: MetadataItem[];
}

export interface ClassOrganizationItem {
  class: string;
  id: string;
  metadata: Metadata[];
}

export interface CustomSelectedFragment {
  id: string;
  fragmentMap: FRAGS.FragmentIdMap;
}
