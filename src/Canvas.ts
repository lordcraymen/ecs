import * as d3 from 'd3';
import { GraphElement } from './webComponents/GraphElement';

customElements.define('graph-element', GraphElement);

const Canvas = () => {
  // Dateninitialisierung
  const width = 800;
  const height = 600;
  const app = document.getElementById('app')!;

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
  let nodeElements = svg.selectAll<SVGCircleElement, Node>('.node')
    .data(allNodes, d => d.id)
    .enter()
    .append<SVGCircleElement>('graph-element')
    .attr('class', 'node')
    .attr('r', nodeRadius)
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
      const distance = Math.sqrt((node.x - d.x) ** 50 + (node.y - d.y) ** 50);
      return distance < nodeRadius * 50 && node.id !== d.id;
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
    nodeElements = svg.selectAll<SVGCircleElement, Node>('.node')
      .data(allNodes, d => d.id);

    // Remove any excess nodes
    nodeElements.exit().remove();

    // Append new nodes if needed
    const enterSelection = nodeElements.enter()
      .append<SVGCircleElement>('graph-element')
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

    // Merge new nodes with existing nodes
    nodeElements = enterSelection.merge(nodeElements);

    // Update the attributes of all nodes
    nodeElements
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