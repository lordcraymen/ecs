import './style.css'
import { ECSEngine } from './engine';
import { Entity } from './Entity';
import { World } from './world';
import { DomRenderSystem } from './systems';

const world = new World();
const entity = new Entity();
world.addEntity(entity);

const root = document.querySelector<HTMLDivElement>('#app') || document.createElement('div');
const renderer = new DomRenderSystem(root);

const engine = new ECSEngine(world,new Set([renderer]));


