<template>
  <div>
    <h1>{{ branch.title }}</h1>
    <p>{{ branch.content }}</p>
    <ul>
      <li v-for="(author, index) in branch.authors" :key="index">
        {{ author }}
      </li>
    </ul>
  </div>
</template>

<script>
import { BranchMixin } from "vue-data-branch";

export default {
  mixins: [BranchMixin],
  branch: {
    root: "blog",
    path: "editor.article",
    keys: ["title", "content", "authors"],
  },
};
</script>

<style>
</style>