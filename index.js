import getObjectAtPath from "lodash.get";
import setObjectAtPath from "lodash.set";
import cloneDeep from "lodash.clonedeep";
import pickProperties from "lodash.pick";
import isEqual from "lodash.isequal";

// import Vue from "vue";

/**
 * Root = {
 *  name: "", // required
 *  initialData: {}, // required
 *  getData(),
 *  getDataAsync(),
 *  onDataUpdate(updatedData),
 *  onBranchUpdate({root, path, keys}, updatedBranch)
 * }
 */

// const test = [1, 2, 3];

// console.log(getObjectAtPath())

const VueDataBranch = {
  install(Vue, options) {
    const roots = options.roots;
    const rootsByName = {};
    const dataByRootName = Vue.observable({});

    if (roots === undefined || roots === null || !roots.length || roots.length === 0 || !Array.isArray(roots)) {
      throw new Error("VueDataBranch: roots array is not specified.");
    }

    for (let i = 0; i < roots.length; i++) {
      const root = roots[i];
      if (!root.name) {
        throw new Error(`VueDataBranch: root without name at index ${i}`);
      }

      if (Object.keys(rootsByName).indexOf(root.name) !== -1) {
        throw new Error(`VueDataBranch: duplicate root name at index ${i}`);
      }

      rootsByName[root.name] = root;

      Vue.set(dataByRootName, root.name, { ...root.initialData });
    }

    const pickBranch = (rootName, { path, keys }) => {
      const root = rootsByName[rootName];
      if (root === undefined || root === null) {
        throw new Error(`VueDataBranch: Couldn't find root with name: ${rootName}`);
      }

      const rootData = dataByRootName[rootName];

      let pickedBranch = rootData;

      if (path) {
        pickedBranch = getObjectAtPath(rootData, path);
      }

      if (keys && keys.length > 0) {
        pickedBranch = pickProperties(pickedBranch, keys);
      }

      // console.log({ pickedBranch });

      return cloneDeep(pickedBranch);
    };

    Vue.mixin({
      dataBranch: {
        root: null, // if specified, this must be a Vue.observable object
        path: null,
        keys: null,
      },
      data() {
        return {
          branch: null,
        };
      },
      created() {
        const root = this.$options.dataBranch.root;
        const path = this.getBranchPath() || this.$options.dataBranch.path;
        const keys = this.getBranchKeys() || this.$options.dataBranch.keys;

        if (root) {
          this.branch = pickBranch(root, { path, keys });
        }
      },
      methods: {
        getBranchPath() {
          return this.$options.dataBranch.path;
        },
        getBranchKeys() {
          return this.$options.dataBranch.keys;
        },
        shouldUpdateRootBranch() {
          return true;
        },
        beforeRootBranchUpdate(branch) {
          return branch;
        },
      },
      watch: {
        branch: {
          deep: true,
          handler() {
            const rootName = this.$options.dataBranch.root;
            const path = this.getBranchPath() || this.$options.dataBranch.path;
            const keys = this.getBranchKeys() || this.$options.dataBranch.keys;

            if (this.branch === null || this.branch === undefined) {
              return;
            }

            // if (!this.shouldUpdateRootBranch()) {
            //   return;
            // }

            if (isEqual(this.branch, pickBranch(rootName, { path, keys }))) {
              return;
            }

            let updatedBranch = cloneDeep(this.branch);

            // const mutatedBranch = this.beforeRootBranchUpdate(cloneDeep(this.branch));
            // if (mutatedBranch !== undefined && mutatedBranch !== null) {
            //   const updatedBranchSortedKeys = Object.keys(updatedBranch).sort();
            //   const mutatedBranchSortedKeys = Object.keys(mutatedBranch).sort();

            //   if (
            //     updatedBranchSortedKeys.length === mutatedBranchSortedKeys.length &&
            //     updatedBranchSortedKeys.every(function (key, index) {
            //       return key === mutatedBranchSortedKeys[index];
            //     })
            //   ) {
            //     updatedBranch = mutatedBranch;
            //   }
            // }

            // console.log({ updatedBranch });

            const root = rootsByName[this.$options.dataBranch.root];

            const rootDataClone = cloneDeep(dataByRootName[root.name]);

            if (this.getBranchPath()) {
              setObjectAtPath(rootDataClone, this.getBranchPath(), updatedBranch);
              Vue.set(dataByRootName, root.name, rootDataClone);
            } else {
              Vue.set(dataByRootName, root.name, { ...rootDataClone, ...updatedBranch });
            }

            if (root.onDataUpdate) {
              root.onDataUpdate(cloneDeep(dataByRootName[root.name]));
            }
            if (root.onBranchUpdate) {
              root.onBranchUpdate(this.$options.dataBranch, cloneDeep(updatedBranch));
            }
          },
        },
      },
    });
  },
};

export default VueDataBranch;
