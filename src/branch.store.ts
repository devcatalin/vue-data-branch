import Vue from "vue";

const dataByRoot = Vue.observable({});

export const insertRoot = (root) => {
  Vue.set(dataByRoot, root.name, { ...root.initialData });

  // if (root.fetch)
};
