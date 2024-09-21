import { IComponent } from "../../types";

const updatedComponents = new Set<IComponent>();

const componentProxyHandler = { 
    set: (target: IComponent, property: string | number | symbol, value: any) => {
        updatedComponents.add(target);
        return Reflect.set(target, property, value);
    }
};

abstract class Component implements IComponent {
    public readonly type: string;
    public hasUpdate: () => boolean = () => updatedComponents.has(this);
    
    constructor(type: string = "Component") {
        const proxy = new Proxy(this, componentProxyHandler);
        this.type = type;
        return proxy;
    }
}

export { Component, updatedComponents };