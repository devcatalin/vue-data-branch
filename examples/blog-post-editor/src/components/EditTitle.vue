<template>
  <div>
    <label>Title: </label>
    <input v-model="branch.title" />
  </div>
</template>

<script>
import { BranchMixin } from "vue-data-branch";

export default {
  mixins: [BranchMixin],
  branch: {
    root: "blog",
    path: "editor.article",
    keys: ["title"],
  },
};
</script>
