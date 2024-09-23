type TransformFunction<I, O> = (input: I, output: O) => void;

interface NodeTypeFactoryOptions<I, O> {
  incomingProperties: Partial<I>;
  outgoingProperties: Partial<O>;
  transformProperties: TransformFunction<I, O>;
}

const NodeTypeFactory = <I, O>(options: NodeTypeFactoryOptions<I, O>) => {
  return class {
    private incoming: I;
    private outgoing: O;
    private transform: TransformFunction<I, O>;

    constructor(properties: Partial<I>) {
      this.incoming = { ...options.incomingProperties, ...properties } as I;
      this.outgoing = { ...options.outgoingProperties } as O;
      this.transform = options.transformProperties;
      this.updateOutgoingProperties();
    }

    // Proxy für die eingehenden Eigenschaften
    private incomingProxy = new Proxy((this.incoming as Object), {
      set: (target, property, value) => {
        target[property as keyof I] = value;
        this.updateOutgoingProperties();
        return true;
      },
      get: (target, property) => {
        return target[property as keyof I];
      }
    });

    // Proxy für die ausgehenden Eigenschaften
    private outgoingProxy = new Proxy(this.outgoing, {
      get: (target, property) => {
        return target[property as keyof O];
      }
    });

    // Getter und Setter für die eingehenden Eigenschaften
    set properties(properties: Partial<I>) {
      Object.assign(this.incomingProxy, properties);
    }

    get properties(): O {
      return this.outgoingProxy;
    }

    // Aktualisieren Sie die ausgehenden Eigenschaften basierend auf den Transformationsfunktionen
    private updateOutgoingProperties() {
      this.transform(this.incoming, this.outgoing);
    }
  };
};

// Beispiel für die Verwendung der Factory
interface IncomingProperties {
  x: number;
  y: number;
}

interface OutgoingProperties {
  sum: number;
  product: number;
}

const transformFunction: TransformFunction<IncomingProperties, OutgoingProperties> = (input, output) => {
  output.sum = input.x + input.y;
  output.product = input.x * input.y;
};

const MyNodeClass = NodeTypeFactory({
  incomingProperties: { x: 0, y: 0 },
  outgoingProperties: { sum: 0, product: 0 },
  transformProperties: transformFunction,
});

const instance1 = new MyNodeClass({ x: 3, y: 4 });
console.log(instance1.properties.sum); // 7
console.log(instance1.properties.product); // 12

// Verwenden Sie die Ausgabeeigenschaften von instance1 als Eingabeeigenschaften für instance2
const instance2 = new MyNodeClass({ x: instance1.properties.sum, y: instance1.properties.product });
console.log(instance2.properties.sum); // 19
console.log(instance2.properties.product); // 84

export { NodeTypeFactory };