import isEqual from "lodash.isequal";

import { IBranchOptions, IBranchMixin, IBranchComponent } from "./interfaces";

import { isValidBranchComponent } from "./typeGuards";

import { pickBranch, updateRootDataBranch } from "./rootDataStore";

const BranchMixin: IBranchMixin = {
  data() {
    return {
      branch: {},
    };
  },
  created() {
    const rootName = (this as any).getRootName();
    const branchPath = (this as any).getBranchPath();
    const branchKeys = (this as any).getBranchKeys();

    (this as any).branch = pickBranch({
      root: rootName,
      path: branchPath,
      keys: branchKeys,
    });
  },
  watch: {
    branch: {
      deep: true,
      handler() {
        if (!isValidBranchComponent(this as any)) {
          return;
        }
        const self: IBranchComponent = this as any as IBranchComponent;

        if (!self.shouldUpdateBranch()) {
          return;
        }

        const originalBranch: unknown = self.getBranch();
        if (!isEqual(self.branch, originalBranch)) {
          updateRootDataBranch(self.$options.branch, self.branch);
        }
      },
    },
  },
  methods: {
    getBranch() {
      const rootName = (this as any).getRootName();
      const branchPath = (this as any).getBranchPath();
      const branchKeys = (this as any).getBranchKeys();
      return pickBranch({
        root: rootName,
        path: branchPath,
        keys: branchKeys,
      });
    },
    getRootName() {
      return ((this as any).$options?.branch as IBranchOptions)?.root;
    },
    getBranchKeys() {
      return ((this as any).$options?.branch as IBranchOptions)?.keys;
    },
    getBranchPath() {
      return ((this as any).$options?.branch as IBranchOptions)?.path;
    },
    shouldUpdateBranch() {
      return true;
    },
  },
};

export default BranchMixin;
