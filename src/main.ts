import './style.css'
import { ECSEngine } from './engine';
import { Entity } from './Entity';
import { PositionComponent, BoundsComponent } from './components';
import { World } from './World';
import { DomRenderSystem } from './systems';

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

//world.addEntity(new Entity(new Set([globalBounds,new PositionComponent(400,400)])));

const root = document.querySelector<HTMLDivElement>('#app') || document.createElement('div');
const renderer = new DomRenderSystem(root);

const engine = new ECSEngine(world,new Set([renderer]));

engine.start().then(() => console.log('Engine started'));


