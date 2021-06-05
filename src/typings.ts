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
  path: string;
  keys: string[];
}

export interface IBranchMixinMethods {
  getBranch(): unknown;
  getRootName(): string;
  getBranchPath(): string;
  getBranchKeys(): string[];
  shouldUpdateBranch(): boolean;
}

export interface IBranchMixin {
  branch: IBranchOptions;
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

export function isValidBranchOptions(value: IBranchOptions): value is IBranchOptions {
  if (value.root && value.path && value.keys) {
    return true;
  }
  return false;
}

export function isValidBranchComponent(value: unknown): value is IBranchComponent {
  if ((value as IBranchComponent).branch && isValidBranchOptions((value as IBranchComponent).$options?.branch)) {
    return true;
  }
  return false;
}
