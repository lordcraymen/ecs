import { Component } from "../Component";

class SelectionComponent extends Component {
    public isSelected: boolean = false;

    constructor() {
        super("Selection");
    }
}

export { SelectionComponent };