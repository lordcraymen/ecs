import * as d3 from "d3";

class D3Simulation {
  private simulation: d3.Simulation<any, any>;
  public radialForce: d3.ForceRadial<any>;

  constructor(parentNode: any, padding: number) {
    this.radialForce = d3
      .forceRadial(
        0,
        () => parentNode.x,
        () => parentNode.y
      )
      .strength(0.5);
    this.simulation = d3
      .forceSimulation()
      .force(
        "collision",
        d3.forceCollide().radius((d: any) => d.r + padding)
      )
      .force("attraction", this.radialForce);
  }

  public on(
    type: string,
    callback: (this: d3.Simulation<any, any>, ...args: any[]) => void
  ): this {
    this.simulation.on(type, callback);
    return this;
  }

  public nodes(nodes: any[]): this {
    this.simulation.nodes(nodes);
    return this;
  }

  public addNode(node: any): this {
    const nodes = this.simulation.nodes();
    nodes.push(node);
    this.simulation.nodes(nodes);
    return this;
  }

  public removeNode(node: any): this {
    const nodes = this.simulation.nodes().filter((n) => n.id !== node.id);
    this.simulation.nodes(nodes);
    return this;
  }

  public restart(): this {
    this.simulation.restart();
    return this;
  }

  public stop(): this {
    this.simulation.stop();
    return this;
  }
}

class LocalSimulation {
  private simulationInstance: any;
  private subscribers: Set<HTMLElement> = new Set();
  private parentNode: HTMLElement;

  constructor(
    parentNode: HTMLElement,
    simulation: D3Simulation = new D3Simulation(parentNode, 10)
  ) {
    this.parentNode = parentNode;
    this.simulationInstance = simulation;
    this.simulationInstance.on("tick", () => this.ticked());
  }

  private ticked() {
    const parentNode = this.parentNode;
    const centerX = parentNode.offsetLeft + parentNode.offsetWidth / 2;
    const centerY = parentNode.offsetTop + parentNode.offsetHeight / 2;

    this.subscribers.forEach((node) => {
      d3.select(node)
        .style("left", (d: any) => `${d.x - d.r + centerX}px`)
        .style("top", (d: any) => `${d.y - d.r + centerY}px`);
    });
  }

  private updateSimulation = () => this.simulationInstance.nodes(Array.from(this.subscribers)).alpha(1).restart();

  public subscribe(node: any) {
    this.subscribers.add(node);
    this.updateSimulation();
    this.updateParentNode(this.parentNode);
    return () => this.unsubscribe(node);
  }

  public unsubscribe(node: any) {
    this.subscribers.delete(node);
    this.updateSimulation();
    if (this.subscribers.size === 0) { this.stop(); }
    this.updateParentNode(this.parentNode);
  }

  private updateParentNode(parentNode: any) {
    const nodes = Array.from(this.subscribers).map((node) => ({
      x: node.offsetLeft + node.offsetWidth / 2,
      y: node.offsetTop + node.offsetHeight / 2,
      r: Math.max(node.offsetWidth, node.offsetHeight) / 2,
    }));

    const boundingCircle = d3.packEnclose(nodes);

    parentNode.x = boundingCircle.x;
    parentNode.y = boundingCircle.y;
    parentNode.r = boundingCircle.r;
  }

  public stop() {
    this.simulationInstance.stop();
  }

  public start() {
    this.simulationInstance.restart();
  }
}

export { LocalSimulation };
