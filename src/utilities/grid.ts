import * as OBC from "@thatopen/components";

export const createGrid = (components: OBC.Components, world: OBC.World) => {
  const grids = components.get(OBC.Grids);
  const grid = grids.create(world);
  console.log(grid);
};
