import Vue from "vue";
import { IRoot, IBranchOptions } from "./interfaces";
import setObjectAtPath from "lodash.set";
import getObjectAtPath from "lodash.get";
import cloneDeep from "lodash.clonedeep";
import pickProperties from "lodash.pick";

const dataByRoot = Vue.observable({});

export function isValidRootName(value: string): value is keyof typeof dataByRoot {
  return value in dataByRoot;
}

export const getRootData = (root: IRoot | string): unknown => {
  let rootName: string;
  if (typeof root === "string") {
    rootName = root;
  } else {
    rootName = root.name;
  }
  if (!isValidRootName(rootName)) {
    return null;
  }
  return dataByRoot[rootName];
};

export const insertRoot = (root: IRoot) => {
  const initialData = root.initialData ? { ...root.initialData } : {};
  Vue.set(dataByRoot, root.name, initialData);
};

export const updateRootDataBranch = ({ root: rootName, path }: IBranchOptions, updatedBranch: object) => {
  if (!isValidRootName(rootName)) {
    return;
  }

  const rootData: object = dataByRoot[rootName];
  let rootDataCopy: object = cloneDeep(rootData);

  if (path !== undefined && path !== null && typeof path === "string") {
    const objectAtPath = getObjectAtPath(rootData, path);

    setObjectAtPath(rootDataCopy, path, {
      ...(objectAtPath as object),
      ...updatedBranch,
    });
  } else {
    rootDataCopy = {
      ...(rootData as object),
      ...updatedBranch,
    };
  }

  Vue.set(dataByRoot, rootName, rootDataCopy);
};

export const pickBranch = ({ root: rootName, path, keys }: IBranchOptions) => {
  if (!isValidRootName(rootName)) {
    return null;
  }

  const rootData = getRootData(rootName);
  let pickedBranch = rootData;
  if (path) {
    pickedBranch = getObjectAtPath(rootData, path);
  }
  if (keys && keys.length > 0) {
    pickedBranch = pickProperties(pickedBranch, keys);
  }

  return cloneDeep(pickedBranch);
};
