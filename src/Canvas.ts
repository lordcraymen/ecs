import * as d3 from 'd3';

class NodeComponent extends HTMLElement {
  private _type: string = '';
  private _svgContainer: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  public _shape: SVGCircleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  private _clipPath: SVGClipPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
  private _clipId: string = `clip-${Math.random().toString(36).substr(2, 9)}`;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    // Set up the circle's position relative to the SVG container
    this._shape.setAttribute('cx', '50');
    this._shape.setAttribute('cy', '50');
    this._shape.setAttribute('r', '50');

    // Set up the SVG container
    this._svgContainer.setAttribute('width', '100px');
    this._svgContainer.setAttribute('height', '100px');

    // Create a clipPath element using the same circle
    this._clipPath.setAttribute('id', this._clipId);
    const clipCircle = this._shape.cloneNode() as SVGCircleElement; // clone the shape for clipping
    this._clipPath.appendChild(clipCircle);
    this._svgContainer.appendChild(this._clipPath);

    // Apply the clip-path to the SVG container
    this._svgContainer.style.clipPath = `url(#${this._clipId})`;

    this._svgContainer.appendChild(this._shape);
    shadow.appendChild(this._svgContainer);

    // Add styles to make sure the component takes on the size of its content
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
        width: 100px;
        height: 100px;
      }
      svg {
        width: 100%;
        height: 100%;
      }
    `;
    shadow.appendChild(style);
  }

  static get observedAttributes() {
    return ['cx', 'cy', 'r', 'fill', 'stroke', 'stroke-width', 'type'];
  }

  get type() {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
    this.setAttribute('type', value);
  }

  connectedCallback() {
    this.addEventListener('focus', this.onFocus);
    this.addEventListener('blur', this.onBlur);
    this.tabIndex = 0;
  }

  disconnectedCallback() {
    this.removeEventListener('focus', this.onFocus);
    this.removeEventListener('blur', this.onBlur);
  }

  private onFocus = () => {
    this._shape.classList.add('focused'); // Add a class to change the stroke color
  };

  private onBlur = () => {
    this._shape.classList.remove('focused'); // Remove the class to reset the stroke color
  };

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    const circle = this.shadowRoot!.querySelector('circle')!;
    if (name === 'type') {
      this._type = newValue || '';
    } else if (name === 'cx' || name === 'cy') {
      this.updatePosition();
    } else {
      circle.setAttribute(name, newValue || '');
    }
  }

  // Method to set the position of the component using CSS transforms
  private updatePosition() {
    const cx = this.getAttribute('cx');
    const cy = this.getAttribute('cy');
    if (cx !== null && cy !== null) {
      this.style.transform = `translate(${cx}px, ${cy}px)`;
    }
  }
}

customElements.define('graph-node', NodeComponent);


const Canvas = () => {
  // Dateninitialisierung
  const width = 800;
  const height = 600;
  const app = document.getElementById('app')!;
  //const svgnode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  //svgnode.setAttribute('width', width.toString());
  //svgnode.setAttribute('height', height.toString());
  //svgnode.setAttribute('id', 'svg');
  //app.appendChild(svgnode);
  

  //svgnode = 

  const svg = d3.select(app);

  const nodeRadius = 50;

  // Node interface
  interface Node {
    id: string;
    x: number;
    y: number;
    fx: number | null;
    fy: number | null;
    nodes: Node[];
    parent?: Node;
  }

  // Initial groups data
  const nodesData: Node[] = [
    { id: '1', x: 200, y: 300, fx: null, fy: null, nodes: createNodes(5, '1') },
    { id: '2', x: 400, y: 300, fx: null, fy: null, nodes: createNodes(7, '2') },
    { id: '3', x: 600, y: 300, fx: null, fy: null, nodes: createNodes(3, '3') }
  ];

  // Function to create nodes for a given parent node
  function createNodes(count: number, parentId: string): Node[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `${parentId}-${i}`,
      x: Math.random() * width,
      y: Math.random() * height,
      fx: null,
      fy: null,
      nodes: []
    }));
  }

  // Flatten all nodes
  let allNodes = nodesData.flatMap(group => [group, ...group.nodes]);

  // Custom force to attract child nodes to the center of their parent nodes
  function forceParentAttraction(alpha: number) {
    allNodes.forEach(node => {
      if (node.parent) {
        node.vx += (node.parent.x - node.x) * alpha * 0.1;
        node.vy += (node.parent.y - node.y) * alpha * 0.1;
      }
    });
  }

  // Initialize simulation
  const simulation = d3.forceSimulation(allNodes)
    .force('charge', d3.forceManyBody().strength(30))
    .force('collide', d3.forceCollide(nodeRadius + 5))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .on('tick', ticked)
    .force('parentAttraction', forceParentAttraction);

  // Draw nodes
  const nodeElements = svg.selectAll<SVGCircleElement, Node>('.node')
    .data(allNodes, d => d.id)
    .enter()
    .append<SVGCircleElement>('graph-node')
    .attr('class', 'node')
    .attr('r', nodeRadius)
    .attr('fill', 'transparent')
    .attr('stroke', 'black')
    .attr('stroke-width', 1.5)
    .call(d3.drag<SVGCircleElement, Node>()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded)
    );

  let currentDraggedNode: Node | null = null;

  // Drag event handlers
  function dragStarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    currentDraggedNode = d;
  }

  function dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnded(event: d3.D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    currentDraggedNode = null;
    simulation.force('collide', d3.forceCollide(nodeRadius + 5));

    // Check if the node is inside another node
    const parentNode = nodesData.find(node => {
      const distance = Math.sqrt((node.x - d.x) ** 2 + (node.y - d.y) ** 2);
      return distance < nodeRadius * 2 && node.id !== d.id;
    });

    if (parentNode) {
      parentNode.nodes.push(d);
      d.parent = parentNode; // Set the parent property
      allNodes = nodesData.flatMap(group => [group, ...group.nodes]);
      updateNodes();
    }
  }

  // Tick function to update positions
  function ticked() {
    nodeElements
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  }

  // Function to update nodes
  function updateNodes() {
    nodeElements.data(allNodes, d => d.id)
      .attr('r', d => nodeRadius + d.nodes.length * 2)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  }

  // Keydown event listener to disable collision force for the dragged node
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.key === ' ' && currentDraggedNode) {
      simulation.force('collide', d3.forceCollide().radius((node) => node === currentDraggedNode ? 0 : nodeRadius + 5));
    }
  });

  // Keyup event listener to re-enable collision force for all nodes
  document.addEventListener('keyup', (event) => {
    if (event.code === 'Space' || event.key === ' ') {
      simulation.force('collide', d3.forceCollide(nodeRadius + 5));
    }
  });
};

// Export the Canvas function
export { Canvas };