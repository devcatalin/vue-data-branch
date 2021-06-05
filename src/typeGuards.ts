import { IBranchOptions, IBranchComponent } from "./interfaces";

export function isObject(value: any): value is object {
  return value !== undefined && value !== null && typeof value === "object";
}

export function isValidBranchOptions(value: IBranchOptions): value is IBranchOptions {
  if ((value.root && value.path && value.keys) || (value.root)) {
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
