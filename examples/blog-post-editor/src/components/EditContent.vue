<template>
  <div>
    <label>Content: </label>
    <textarea v-model="branch.content" />
  </div>
</template>

<script>
import { BranchMixin } from "vue-data-branch";

export default {
  mixins: [BranchMixin],
  branch: {
    root: "blog",
    path: "editor.article",
    keys: ["content"],
  },
};
</script>
