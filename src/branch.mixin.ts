import getObjectAtPath from "lodash.get";
import setObjectAtPath from "lodash.set";
import cloneDeep from "lodash.clonedeep";
import pickProperties from "lodash.pick";
import isEqual from "lodash.isequal";

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

  return cloneDeep(pickedBranch);
};

/**
 * @param {string} rootName
 * @param {Object[]} branches
 * @param {string} branches[].name
 * @param {string} branches[].path
 * @param {string[]} branches[].props
 * @returns Vue.Mixin
 */
export const makeBranchesMixin = (rootName: string, branches) => {
  const branchByName = Object.fromEntries(branches.map((branch) => [branch.name, branch]));

  return {
    data() {
      return Object.fromEntries(branches.map((branch) => [branch.name, null]));
    },
    methods: {
      getBranchPath(branchName: string) {
        const branch = branchByName[branchName];
        if (!branch) {
          return null;
        }
        return branch.path;
      },
      getBranchKeys(branchName: string) {
        const branch = branchByName[branchName];
        if (!branch) {
          return null;
        }
        return branch.keys;
      },
      beforeRootBranchUpdate(branchName: string) {
        // return branch
      },
    },
  };
};

/**
 * @property {Object[]} branches
 * @property {string} branches[].root
 */
export const BranchMixin = {
  branches: [
    {
      root: null,
      path: null,
      keys: null,
    },
  ],
};
