import { IEntity, IComponent } from "./types";
import { updatedComponents } from "./components/Component/Component";
import { v4 } from 'uuid';

const markComponentAsUpdated = {
    set: function(target: IComponent, prop: string, value: any) {
        target[prop] = value;
        updatedComponents.add(target);
        return true;
    }
}

class Entity implements IEntity {
    private components: Map<IComponent['type'], IComponent> = new Map();
    public readonly id: string;
    
    constructor(components?: Set<IComponent>) {
        this.id = v4();
        components?.forEach(c => this.addComponent(c));
    }

    addComponent(component: IComponent) {
        this.components.set(component.type, new Proxy(component, markComponentAsUpdated) as IComponent);
    }

    removeComponent(component: IComponent) {
        this.components.delete(component.type);
    }

    getComponent(name:IComponent['type']) {
        return this.components.get(name);
    }
}

export { Entity };