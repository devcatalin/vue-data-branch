import { VueConstructor } from "vue";
import { IRoot, IBranchOptions } from "./interfaces";
import setObjectAtPath from "lodash.set";
import getObjectAtPath from "lodash.get";
import cloneDeep from "lodash.clonedeep";
import pickProperties from "lodash.pick";

import { isObject } from "./typeGuards";

let Vue: VueConstructor;

let state: {
  dataByRoot: object
} = {
  dataByRoot: {}
};

export function makeState(VueInstance: VueConstructor) {
  Vue = VueInstance;
  state = (Vue as any).observable({
    dataByRoot: {},
    testData: {
      counter: 0
    }
  });
}

export function isValidRootName(value: string): value is keyof typeof state.dataByRoot {
  return value in state.dataByRoot;
}

export const getDataByRoot = () => {
  return state.dataByRoot;
}

export const getRootData = (root: IRoot | string): object => {
  let rootName: string;
  if (typeof root === "string") {
    rootName = root;
  } else {
    rootName = root.name;
  }
  if (!isValidRootName(rootName)) {
    return {};
  }
  return state.dataByRoot[rootName];
};

export const insertRoot = (root: IRoot) => {
  let initialData = {};
  if (isObject(root.initialData)) {
    initialData = root.initialData;
  }
  Vue.set(state.dataByRoot, root.name, initialData);
};

export const updateRootDataBranch = ({ root: rootName, path }: IBranchOptions, updatedBranch: object) => {
  if (!isValidRootName(rootName)) {
    return;
  }

  const rootData: object = state.dataByRoot[rootName];
  let rootDataCopy: object = cloneDeep(rootData);

  if (path !== undefined && path !== null && typeof path === "string") {
    const objectAtPath = getObjectAtPath(rootDataCopy, path);

    setObjectAtPath(rootDataCopy, path, {
      ...(objectAtPath as object),
      ...updatedBranch,
    });
  } else {
    rootDataCopy = {
      ...(rootDataCopy as object),
      ...updatedBranch,
    };
  }

  Vue.set(state.dataByRoot, rootName, rootDataCopy);
};

export const pickBranch = ({ root: rootName, path, keys }: IBranchOptions): object => {
  if (!isValidRootName(rootName)) {
    return {};
  }

  const rootData = getRootData(rootName);
  let pickedBranch = rootData;
  if (path && path.trim() !== "") {
    pickedBranch = getObjectAtPath(rootData, path);
  }
  if (keys && keys.length > 0) {
    pickedBranch = pickProperties(pickedBranch, keys);
  }

  if (!isObject(pickedBranch)) {
    return {};
  }

  return pickedBranch;
};
