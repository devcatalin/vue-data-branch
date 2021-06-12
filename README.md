# Vue Data Branch

This is an experimental library to test a new way of managing global state in Vue applications.  

# How it works 

The `Branch Plugin` structures the global state as one or multiple roots (think of individual state modules), where each root should have the entire state needed by a feature or a view.  

Then, by adding the `Branch Mixin` to a component, you can pick any `branch` of the state to be mapped to the component's data.  

When the component's branch data is mutated, it will update the root state.  

The `branch` is an object that gets mapped to `this.branch` in the component's data. It is constructed by picking the key-value pairs of the object found at the specified object path.  

All branches have the following properties:
1. `root` - the name of the root to be used
2. `path` - the string containing a valid object path
3. `keys` - the array of keys to be picked and mapped to `this.branch`

# Usage

*main.js*
```javascript
import { BranchPlugin } from "vue-data-branch";

Vue.use(BranchPlugin, { roots: [
  {
    name: "someName",
    initialData: {
      some: {
        nested: {
          property: {
            a: 1,
            b: 2,
            c: 3,
            d: 4
          }
        }
      }
    }
  }
]});

```

*SomeComponent.vue*
```javascript
import { BranchMixin } from "vue-data-branch";

export default {
  branch: {
    root: "someName",
    path: "some.nested.property",
    keys: ["a", "b"]
  },
  mounted() {
    console.log(this.branch); // will display { a: 1, b: 2 }
  }
}
```
