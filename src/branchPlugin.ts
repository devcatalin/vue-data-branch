import { PluginObject } from "vue";
import { IRoot } from "./interfaces";
import { insertRoot } from "./rootDataStore";

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
