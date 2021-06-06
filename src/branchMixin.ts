import isEqual from "lodash.isequal";
import cloneDeep from "lodash.clonedeep";

import { IBranchOptions, IBranchMixin, IBranchComponent } from "./interfaces";

import { isValidBranchComponent } from "./typeGuards";

import { pickBranch, updateRootDataBranch } from "./rootDataStore";

const getSelf = (thisArg: any) => {
  if (!isValidBranchComponent(thisArg)) {
    return null;
  }
  const self: IBranchComponent = thisArg as IBranchComponent;
  return self;
};

const BranchMixin: IBranchMixin = {
  data() {
    return {
      branch: {},
      originalBranch: {},
    };
  },
  created() {
    const self = getSelf(this);
    if (!self) {
      return;
    }
    self.initBranch();
  },
  computed: {
    syncedBranch() {
      const self = getSelf(this);
      if (!self) {
        return {};
      }
      return self.getBranch();
    },
  },
  watch: {
    syncedBranch() {
      const self = getSelf(this);
      if (!self) {
        return;
      }
      if (!isEqual(self.originalBranch, self.syncedBranch)) {
        self.handleConflictSync();
      }
    },
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
      const self = getSelf(this);
      if (!self) {
        return;
      }
      const branch = self.getBranch();

      self.branch = cloneDeep(branch);
      self.originalBranch = cloneDeep(branch);
    },
    getBranch() {
      const self = getSelf(this);
      if (!self) {
        return {};
      }

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
    handleConflictSync() {
      const self = getSelf(this);
      if (!self) {
        return;
      }
      self.syncBranch();
    },
    syncBranch() {
      const self = getSelf(this);
      if (!self) {
        return;
      }
      self.branch = cloneDeep(self.syncedBranch);
      self.originalBranch = cloneDeep(self.syncedBranch);
    },
  },
};

export default BranchMixin;
