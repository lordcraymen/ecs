import { IWorld, IEntity, ISystem } from "./types";

class World implements IWorld {
    entities = new Set<IEntity>();
    systems = new Set<ISystem>();

    constructor(entities?: Set<IEntity>, systems?: Set<ISystem>) {
        this.entities = new Set(entities);
        this.systems = new Set(systems);
    }
    
    public addEntity(entity: IEntity) {
        this.entities.add(entity);
    }
}

export { World };