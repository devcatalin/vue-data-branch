import { VueConstructor, ComponentOptions } from "vue";

type VueMixin = VueConstructor | ComponentOptions<never>;

export interface Root {
  name: string;
  initialData?: object;
  getData?(): object;
  getDataAsync?(): Promise<object>;
  onDataUpdate?(updatedData: object): void;
  onBranchUpdate?(updatedBranch: object): void;
}

export interface BranchOptions {
    root: string,
    path: string,
    keys: string[]
}

export interface BranchMixin {
    data(): { branch: object } 
    branch: BranchOptions,
    methods: {
        getBranchPath(): string,
        getBranchKeys(): string[],
        shouldUpdateRootBranch(): boolean,
        beforeRootBranchUpdate(): object
    }
}

export interface BranchMixinOptions extends VueMixin {};