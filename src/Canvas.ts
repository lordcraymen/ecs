import * as d3 from 'd3';

const Canvas = () => {
  // Dateninitialisierung
  const width = 800;
  const height = 600;
  const app = document.getElementById('app')!;
  const svgnode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgnode.setAttribute('width', width.toString());
    svgnode.setAttribute('height', height.toString());
    svgnode.setAttribute('id', 'svg');
    app.appendChild(svgnode);
  const svg = d3.select(svgnode);

  const nodeRadius = 15;

  // Drei Gruppen mit unterschiedlich vielen Elementen
  const groupsData = [
    { id: 1, x: 200, y: 300, nodes: [] },
    { id: 2, x: 400, y: 300, nodes: [] },
    { id: 3, x: 600, y: 300, nodes: [] }
  ];

  // Erstelle Knoten für jede Gruppe
  groupsData[0].nodes = createNodes(5, groupsData[0]);
  groupsData[1].nodes = createNodes(7, groupsData[1]);
  groupsData[2].nodes = createNodes(3, groupsData[2]);

  // Alle Knoten
  let nodes = groupsData.flatMap(group => group.nodes);

  // Simulation initialisieren
  const simulation = d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-30))
    .force('collide', d3.forceCollide(nodeRadius + 5))
    .on('tick', ticked);

  // Gruppen zeichnen
  const groupElements = svg.selectAll('.group')
    .data(groupsData)
    .enter()
    .append('circle')
    .attr('class', 'group')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => calculateGroupRadius(d))
    .lower();

  // Knoten zeichnen
  const nodeElements = svg.selectAll('.node')
    .data(nodes, d => d.id)
    .enter()
    .append('circle')
    .attr('class', 'node')
    .attr('r', nodeRadius)
    .attr('fill', 'steelblue')
    .call(d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded)
    );

  // Funktionen zur Knoten- und Gruppenverwaltung
  function createNodes(num, group) {
    const angleStep = (2 * Math.PI) / num;
    return d3.range(num).map(i => {
      const angle = i * angleStep;
      return {
        id: `node-${group.id}-${i}`,
        x: group.x + (nodeRadius * 3) * Math.cos(angle),
        y: group.y + (nodeRadius * 3) * Math.sin(angle),
        fx: null,
        fy: null,
        group: group
      };
    });
  }

  function calculateGroupRadius(group) {
    const n = group.nodes.length;
    if (n === 0) return nodeRadius * 2;
    return (nodeRadius / Math.sin(Math.PI / n)) + nodeRadius;
  }

  function updateGroupLayout(group) {
    const n = group.nodes.length;
    if (n === 0) return;

    const angleStep = (2 * Math.PI) / n;
    group.nodes.forEach((node, i) => {
      const angle = i * angleStep;
      node.fx = group.x + (calculateGroupRadius(group) - nodeRadius) * Math.cos(angle);
      node.fy = group.y + (calculateGroupRadius(group) - nodeRadius) * Math.sin(angle);
    });

    // Aktualisiere den Gruppenradius
    groupElements
      .filter(d => d.id === group.id)
      .attr('r', calculateGroupRadius(group));
  }

  // Simulationsticker
  function ticked() {
    nodeElements
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  }

  // Drag-Funktionen
  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();

    // Entferne Knoten aus der Gruppe
    if (d.group) {
      d.group.nodes = d.group.nodes.filter(n => n.id !== d.id);
      updateGroupLayout(d.group);
      d.group = null;
      d.fx = null;
      d.fy = null;
    }
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);

    // Überprüfe, ob Knoten in einer Gruppe abgelegt wurde
    let droppedInGroup = false;
    groupsData.forEach(group => {
      const distance = Math.hypot(d.x - group.x, d.y - group.y);
      if (distance < calculateGroupRadius(group)) {
        // Füge Knoten zur Gruppe hinzu
        d.group = group;
        group.nodes.push(d);
        updateGroupLayout(group);
        droppedInGroup = true;
      }
    });

    if (!droppedInGroup) {
      // Knoten bleibt frei beweglich
      d.fx = null;
      d.fy = null;
    }
  }

  // Starte die Simulation
  simulation.nodes(nodes);

  // Aktualisiere die Visualisierung bei Datenänderungen
  function updateVisualization() {
    nodes = groupsData.flatMap(group => group.nodes).concat(nodes.filter(n => !n.group));

    nodeElements.data(nodes, d => d.id);

    nodeElements.exit().remove();

    nodeElements.enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', nodeRadius)
      .attr('fill', 'steelblue')
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded)
      );

    groupElements
      .attr('r', d => calculateGroupRadius(d));

    simulation.nodes(nodes);
    simulation.alpha(1).restart();
  

    }
}

export { Canvas };
