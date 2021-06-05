import { PluginObject } from "vue";
import { IRoot } from "./typings";
import { insertRoot } from "./rootData.store";

type BranchPluginOptions = {
  roots: IRoot[];
};

const BranchPlugin: PluginObject<BranchPluginOptions> = {
  install(Vue, options) {
    if (!options) {
      throw new Error("VueDataBranch: no roots specified.");
    }
    const roots: IRoot[] = options.roots;

    for (const root of roots) {
      insertRoot(root);
    }
  },
};

export default BranchPlugin;
