import isEqual from "lodash.isequal";
import cloneDeep from "lodash.clonedeep";

import { IBranchOptions, IBranchMixin, IBranchComponent } from "./interfaces";

import { isValidBranchComponent } from "./typeGuards";

import { pickBranch, updateRootDataBranch } from "./rootDataStore";

const BranchMixin: IBranchMixin = {
  data() {
    return {
      branch: {},
      originalBranch: {}
    };
  },
  created() {
    if (!isValidBranchComponent(this as any)) {
      return;
    }
    const self: IBranchComponent = this as any as IBranchComponent;
    self.initBranch();
  },
  computed: {
    syncedBranch() {
      const self: IBranchComponent = this as any as IBranchComponent;
      const branch = self.getBranch();
      return branch;
    }
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

        if (!isEqual(self.branch, self.originalBranch)) {
          updateRootDataBranch(self.$options.branch, self.branch);
          self.originalBranch = cloneDeep(self.branch);
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
      const branch = self.getBranch();

      self.branch = cloneDeep(branch);
      self.originalBranch = cloneDeep(branch);
    },
    getBranch() {
      if (!isValidBranchComponent(this as any)) {
        return {};
      }
      const self: IBranchComponent = this as any as IBranchComponent;

      const pickedBranch = pickBranch({
        root: self.getRootName(),
        path: self.getBranchPath(),
        keys: self.getBranchKeys(),
      });

      return pickedBranch;
    },
    getRootName() {
      return ((this as any).$options?.branch as IBranchOptions)?.root;
    },
    getBranchKeys() {
      return ((this as any).$options?.branch as IBranchOptions)?.keys || [];
    },
    getBranchPath() {
      return ((this as any).$options?.branch as IBranchOptions)?.path || "";
    },
    shouldUpdateBranch() {
      return true;
    },
  },
};

export default BranchMixin;
