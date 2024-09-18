import { IEntity, IComponent } from "./types";

class Entity implements IEntity {
    public components: Set<IComponent>;
    private readonly id: string;
    
    constructor(components?: Set<IComponent>) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.components = new Set(components);
    }

    addComponent(component: IComponent) {
        if (![...this.components].some(c => c instanceof component.constructor)) {
            this.components.add(component);
        }
    }

    removeComponent(component: IComponent) {
        this.components.delete(component);
    }

    getComponent(name:IComponent['constructor']) {
        return [...this.components].find(c => c instanceof name);
    }
}

export { Entity };