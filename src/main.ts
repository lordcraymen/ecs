import './style.css'
import { ECSEngine } from './engine';
import { Entity } from './Entity';
import { PositionComponent, BoundsComponent } from './components';
import { World } from './World';
import { PhysicSystem, DomRenderSystem } from './systems';

const world = new World();

const globalBounds = new BoundsComponent(100,100);

const entity = new Entity(new Set([globalBounds,new PositionComponent(0,0)]));
declare global {
  interface Window {
	entity: Entity;
    bounds: BoundsComponent;
  }
}

window.entity = entity;
window.bounds = globalBounds;

world.addEntity(entity);

world.addEntity(new Entity(new Set([globalBounds,new PositionComponent(400,400)])));

const root = document.querySelector<HTMLDivElement>('#app') || document.createElement('div');
const renderer = new DomRenderSystem(root);

const documentBounds = new BoundsComponent(document.documentElement.clientWidth,document.documentElement.clientHeight);
const physic = new PhysicSystem(documentBounds);

window.addEventListener('resize',async () => {
  documentBounds.width = document.documentElement.clientWidth;
  documentBounds.height = document.documentElement.clientHeight;
});

// Event-Listener für Doppelklick hinzufügen
root.addEventListener('dblclick', (event) => {
  const rect = root.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  globalBounds.width = globalBounds.width;

  const newEntity = new Entity(new Set([globalBounds, new PositionComponent(x, y)]));
  world.addEntity(newEntity);
});

const engine = new ECSEngine(world,new Set([physic,renderer]));

engine.start().then(() => console.log('Engine started'));


