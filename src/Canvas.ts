import * as d3 from 'd3';

const definedXPosition = (d: any) => {
    return d.x;
}

const definedYPosition = (d: any) => {
    return d.y;
}

const Canvas = () => {

    const svg = d3.select('#app')
        .append('svg')
        .attr('width', 600)
        .attr('height', 600);

    svg.append('circle')
        .attr('cx', 300)
        .attr('cy', 300)
        .attr('r', 100)
        .attr('fill', 'blue');

    const nodes = svg.selectAll('circle');

    const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(800 / 2, 600 / 2))
        .force('x', d3.forceX(d => definedXPosition(d)).strength(1))
        .force('y', d3.forceY(d => definedYPosition(d)).strength(1));

    simulation.on('tick', () => {
        svg.selectAll('circle')
            .attr('cx', d => definedXPosition(d))
            .attr('cy', d => definedYPosition(d));
    }
    );
}





export { Canvas };