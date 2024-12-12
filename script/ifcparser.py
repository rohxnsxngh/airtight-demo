import ifcopenshell

# Load the IFC file
ifc_file = ifcopenshell.open(r'C:\_dev\core-engine-v2\resources\Ifc2x3_Duplex_Architecture.ifc')


# Function to get the material information
def get_materials(element):
    materials = []
    material_relations = ifc_file.get_inverse(element)
    for rel in material_relations:
        if rel.is_a('IfcRelAssociatesMaterial'):
            material = rel.RelatingMaterial
            if material.is_a('IfcMaterialList'):
                materials.extend(material.Materials)
            else:
                materials.append(material)
    return materials

# Function to get dimensions (simplified example)
def get_dimensions(element):
    dimensions = {}
    if element.is_a('IfcProduct'):
        if element.Representation:
            for rep in element.Representation.Representations:
                if rep.is_a('IfcShapeRepresentation'):
                    for item in rep.Items:
                        if item.is_a('IfcExtrudedAreaSolid'):
                            profile = item.SweptArea
                            if profile.is_a('IfcRectangleProfileDef'):
                                dimensions['Width'] = profile.XDim
                                dimensions['Height'] = profile.YDim
    return dimensions

# Iterate through elements and extract information
for element in ifc_file.by_type('IfcElement'):
    print(f"Element: {element.Name}")
    
    # materials = get_materials(element)
    # for material in materials:
    #     print(f"  Material: {material.Name}")
    #     if material.HasProperties:
    #         for prop_set in material.HasProperties:
    #             for prop in prop_set.HasProperties:
    #                 print(f"    Property: {prop.Name} - {prop.NominalValue}")

    # dimensions = get_dimensions(element)
    # for dim, value in dimensions.items():
    #     print(f"  {dim}: {value}")

    # print("  Metadata:")
    # for attribute in element:
    #     print(f"    {attribute}: {getattr(element, attribute)}")
