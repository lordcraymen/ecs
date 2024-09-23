import { v4 as uuidv4 } from "uuid";
import { eventBus } from "./EventBus";

// Rights Management Proxy Handler
function rightsManagementHandler(userRights) {
  return {
    get(target, prop, receiver) {
      if (prop === "then") {
        // Allow Promises to function correctly
        return Reflect.get(target, prop, receiver);
      }
      if (target.checkAccess("read", prop, userRights)) {
        return Reflect.get(target, prop, receiver);
      } else {
        throw new Error(`Access Denied: Cannot read property '${prop}'`);
      }
    },
    set(target, prop, value, receiver) {
      if (target.checkAccess("write", prop, userRights)) {
        return Reflect.set(target, prop, value, receiver);
      } else {
        throw new Error(`Access Denied: Cannot write property '${prop}'`);
      }
    },
  };
}

type NodeReference = UUIDNode["id"]

// Abstract Node Class
abstract class Node {
  public readonly type: Symbol
  private incoming: Map<string, Node | NodeReference>;
  private outgoing: Map<string, Node | NodeReference>;
  get id(): NodeReference {
    return this.outgoing.get('id') as NodeReference;
  }
  private transformer: (incoming: Object, outgoing: Object) => void | null;
  
  private accessRights: {
    read: string[];
    write: string[];
  };

  private loaded: boolean = false;


  constructor(type: Symbol) {
    this.type = type;
    this.addOutgoingProperty("id", new UUIDNode());
    this.incoming = new Map(); // Incoming properties
    this.outgoing = new Map(); // Outgoing properties
    this.transformer = null; // Transformer function
    this.accessRights = {
      read: ["superuser", "admin"],
      write: ["superuser", "admin"],
    };
    this.loaded = false;
  }

  // Add incoming property
  addIncomingProperty(propName: string, Property: Node | NodeReference) {
    this.incoming.set(propName, Property);
  }

  // Transformer logic
  transform() {
    if (typeof this.transformer === "function") {
      this.transformer(this);
    }
  }

  // Asynchronous loading of node data
  private static load() {
    // Return a Promise that resolves when loading is complete
    return new Promise((resolve) => {
      // Simulate asynchronous loading (e.g., fetch from remote service)
      setTimeout(() => {
        // Simulated data
        this.incoming = { sampleInput: "Hello World" };
        this.transformer = function (node) {
          node.outgoing.transformedOutput =
            node.incoming.sampleInput.toUpperCase();
        };
        this.loaded = true;
        resolve(this);
      }, 1000); // Simulate 1-second network delay
    });
  }
}

// Node Factory Function with Proxy and Async Loading
function createNode(id = null, userRights = []) {
  const node = new Node(id);

  // Wrap node in Proxy for rights management
  const proxyNode = new Proxy(node, rightsManagementHandler(userRights));

  // Return a Promise that resolves to the proxy node after loading
  const nodePromise = proxyNode.load().then(() => {
    // Subscribe to events after loading
    proxyNode.on("Transformation", proxyNode.handleTransformation);
    proxyNode.on("Reification", proxyNode.handleReification);
    proxyNode.on("Consolidation", proxyNode.handleConsolidation);

    return proxyNode;
  });

  return nodePromise;
}

// Bootstrap Function to Initialize System with Superuser
async function bootstrapSystem() {
  // Define superuser rights
  const superuserRights = ["superuser"];

  // Create superuser node
  const superuserNode = await createNode(null, superuserRights);

  console.log("Superuser Node Loaded:", superuserNode);

  // Superuser creates a new user node
  const userRights = ["user"];
  const userNodePromise = createNode(null, userRights);

  // Show placeholder while loading
  console.log("Loading user node...");

  // Await user node loading
  const userNode = await userNodePromise;
  console.log("User Node Loaded:", userNode);

  // Superuser emits a Transformation event
  superuserNode.emit("Transformation", {
    newProperties: { role: "admin" },
  });

  // User node attempts to read a property
  try {
    console.log("User Node Outgoing:", userNode.outgoing);
  } catch (error) {
    console.error(error.message);
  }

  // User node attempts to write a property
  try {
    userNode.outgoing.newData = "Test";
  } catch (error) {
    console.error(error.message);
  }
}

// Execute the bootstrap function
bootstrapSystem().catch((error) => {
  console.error("Error in bootstrap:", error);
});

// Global Event Handlers (if needed)
eventBus.on("Transformation", (payload) => {
  console.log("Global Transformation event received:", payload);
  // Additional global handling if necessary
});


class UUIDNode extends Node {
  constructor() {
    super(Symbol("UUID"));
  }
}
