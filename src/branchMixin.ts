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
    if (!isValidBranchComponent(this as any)) {
      return;
    }
    const self: IBranchComponent = this as any as IBranchComponent;
    self.initBranch();
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
    initBranch() {
      if (!isValidBranchComponent(this as any)) {
        return;
      }
      const self: IBranchComponent = this as any as IBranchComponent;

      const pickedBranch = pickBranch({
        root: self.getRootName(),
        path: self.getBranchPath(),
        keys: self.getBranchKeys(),
      });

      self.branch = pickedBranch;
    },
    getBranch() {
      const rootName = (this as any).getRootName();
      const branchPath = (this as any).getBranchPath();
      const branchKeys = (this as any).getBranchKeys();
      const pickedBranch = pickBranch({
        root: rootName,
        path: branchPath,
        keys: branchKeys,
      });

      return pickedBranch;
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
