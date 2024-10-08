import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceX,
  forceY,
} from "d3";

class Simulation {
  private simulationInstance: any;
  constructor() {
    this.simulationInstance = forceSimulation();
    this.simulationInstance.ticked = () => {};
  }

  public subscribe(node: any) {
    this.simulationInstance.nodes(node);
  }

  public unsubscribe(node: any) {
    this.simulationInstance.nodes(node);
  }
}

export { Simulation };
