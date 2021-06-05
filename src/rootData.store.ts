import Vue from "vue";
import { Root } from "./typings";

const dataByRoot = Vue.observable({});

function isValidRootName(value: string): value is keyof typeof dataByRoot {
  return value in dataByRoot;
}

export const getRootData = (root: Root | string) => {
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
}

export const insertRoot = (root: Root) => {
  const initialData = root.initialData ? { ...root.initialData } : {};
  Vue.set(dataByRoot, root.name, initialData);
};

