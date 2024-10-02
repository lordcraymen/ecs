import { v4 as uuidv4 } from "uuid";
import { eventBus } from "./EventBus";


interface IIdentityProvider {
  getIdentity(suggestedID?:string): Promise<string>;
}


const INTERNAL_NODE_ID = Symbol('INTERNAL_NODE_ID');

abstract class Node {
  type: Symbol;
  inputs: Map<,Node>;
  outputs: Set<Node>;
  [INTERNAL_NODE_ID] : string;

  constructor(id:string, type: Symbol, inputs: Set<Node>, outputs: Set<Node>, identityProvider?: IIdentityProvider) {
    this.type = type;
    this.inputs = inputs;
    this.outputs = outputs;
    this[INTERNAL_NODE_ID] = uuidv4();
    identityProvider?.getIdentity(this[INTERNAL_NODE_ID]).then((id) => {
      this[INTERNAL_NODE_ID] = id;
    });
  }

  defineAs(type: Symbol) {
    this.type = type;
    eventBus.emit('nodeTypeChanged', {target: this[INTERNAL_NODE_ID], type: this.type});
  }

  addInput(name:string, node: Node) {
    this.inputs.add(node);
  }

  addOutput(node: Node) {
    this.outputs.add(node);
  }

  removeInput(node: Node) {
    this.inputs.delete(node);
  }

  removeOutput(node: Node) {
    this.outputs.delete(node);
  }

}

export { Node, identityProvider, type IIdentityProvider };
