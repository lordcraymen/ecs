import { IEntity, IComponent } from "./types";

class Entity implements IEntity {
    public components: { [key: IComponent["type"]]: IComponent };
    public readonly id: string;
    public needsProcessing: () => boolean = () => Object.values(this.components).some(c => c.needsProcessing());
    public markAsProcessed: () => void = () => Object.values(this.components).forEach(c => c.markAsProcessed());
    
    constructor(components?: Set<IComponent>) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.components = {};
        if (components) {
            components.forEach(component => {
            this.components[component.type] = component;
            });
        }
    }

    addComponent(component: IComponent) {
        if (![Object.keys(this.components)].some(c => c instanceof component.constructor)) {
            component.setParentID(this.id);
            this.components[component.type] = component;
        }
    }

    removeComponent(component: IComponent) {
        delete this.components[component.type];
    }

    getComponent(name:IComponent['type']) {
        return this.components[name];
    }
}

export { Entity };