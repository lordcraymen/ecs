import { IComponent } from "../../types";

abstract class Component implements IComponent {
    public readonly type: string;
    
    constructor(type: string = "Component") {
        this.type = type;
    }
}

const updatedComponents = new Set<IComponent>();

export { Component, updatedComponents };