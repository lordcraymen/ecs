import d3, {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceX,
  forceY,
} from "d3";


/*
      function createSimulation(parentNode) {
        const radialForce = d3
          .forceRadial(
            0,
            () => parentNode.x,
            () => parentNode.y
          )
          .strength(0.5);
        const simulation = d3
          .forceSimulation()
          .force(
            "collision",
            d3.forceCollide().radius((d) => d.r + padding)
          )
          .force("attraction", radialForce)
          .on("tick", function () {
            // Check if parent position has changed, if so add energy to the simulation
            if (
              lastPositions[parentNode.id] === undefined ||
              lastPositions[parentNode.id].x !== parentNode.x ||
              lastPositions[parentNode.id].y !== parentNode.y
            ) {
              simulation.alpha(0.3).restart();
            }
            lastPositions[parentNode.id] = { x: parentNode.x, y: parentNode.y };

            // Update radial force center to follow the parent's current position
            radialForce.radius(0).x(parentNode.x).y(parentNode.y);

            // Directly update the nodes stored in simulation._nodes
            simulation._nodes.forEach((d) => {
              if (d.parent === parentNode.id) {
                d3.select(`#node-${d.id}`).attr("cx", d.x).attr("cy", d.y);
              }
            });
          });

        simulation._nodes = []; // Store nodes internally

        simulation.add = function (node) {
          simulation._nodes.push(node);
          simulation.nodes(simulation._nodes).alpha(1).restart();
          updateParentNode(parentNode); // Update parent node position and radius
        };

        simulation.remove = function (node) {
          simulation._nodes = simulation._nodes.filter((n) => n.id !== node.id);
          simulation.nodes(simulation._nodes);
          if (simulation._nodes.length === 0) {
            simulation.stop();
          }
          updateParentNode(parentNode); // Update parent node position and radius
        };

        return simulation;
      }
*/

class D3Simulation {
  private radialForce: any;
  private simulationInstance: d3.Simulation<any, any>;

  constructor() {
    this.radialForce = forceRadial(0, () => parentNode.x, () => parentNode.y).strength(0.5);
    this.simulationInstance = forceSimulation()
      .force("collision", forceCollide().radius((d: any) => d.r + padding))
      .force("attraction", this.radialForce)
  }

  public on = (type: string, callback: any) => {};
}

class LocalSimulation {
  private simulationInstance: any;
  
  private lastPositions: { [key: string]: { x: number; y: number } } = {};
  private subscribers: Set<HTMLElement> = new Set();

  constructor(private parentNode: HTMLElement, simulation: D3Simulation = new D3Simulation()) {
    this.simulationInstance = simulation;
    this.simulationInstance.on("tick", () => this.ticked());
  }

  private ticked() {
    const parentNode = this.parentNode;
    if (
      this.lastPositions[parentNode.id] === undefined ||
      this.lastPositions[parentNode.id].x !== parentNode.x ||
      this.lastPositions[parentNode.id].y !== parentNode.y
    ) {
      this.simulationInstance.alpha(0.3).restart();
    }
    this.lastPositions[parentNode.id] = { x: parentNode.x, y: parentNode.y };

    this.radialForce.radius(0).x(parentNode.x).y(parentNode.y);

    this.simulationInstance._nodes.forEach((d: any) => {
      if (d.parent === parentNode.id) {
        d3.select(`#node-${d.id}`).attr("cx", d.x).attr("cy", d.y);
      }
    });
  }

  public subscribe(node: any) {
    this.subscribers.add(node);
    this.simulationInstance.nodes(this.simulationInstance._nodes).alpha(1).restart();
    this.updateParentNode(this.parentNode);
    return () => this.unsubscribe(node);
  }

  public unsubscribe(node: any) {
    this.subscribers.delete(node);
    if (this.subscribers.size === 0) {
      this.stop();
    }
    this.updateParentNode(this.parentNode);
  }

  private updateParentNode(parentNode: any) {
    // Implement the logic to update the parent node position and radius
  }

  public stop() {
    this.simulationInstance.stop();
  }

  public start() {
    this.simulationInstance.restart();
  }
}

export { LocalSimulation };
