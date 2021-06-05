export interface IRoot {
  name: string;
  initialData?: object;
  getData?(): object;
  getDataAsync?(): Promise<object>;
  onDataUpdate?(updatedData: object): void;
  onBranchUpdate?(updatedBranch: object): void;
}

export interface IBranchOptions {
  root: string;
  path?: string;
  keys?: string[];
}

export interface IBranchMixinMethods {
  initBranch(): void;
  getBranch(): object;
  getRootName(): string;
  getBranchPath(): string;
  getBranchKeys(): string[];
  shouldUpdateBranch(): boolean;
}

export interface IBranchMixin {
  created(): void;
  watch: {
    branch: {
      deep: boolean;
      handler(): void;
    };
  };
  data(): { branch: object };
  $options?: unknown;
  methods: IBranchMixinMethods;
}

export interface IBranchComponent extends IBranchMixinMethods {
  $options: {
    branch: IBranchOptions;
  };
  branch: object;
}
