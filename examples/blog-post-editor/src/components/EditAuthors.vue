<template>
  <div>
    <label>Authors: </label>
    <div v-for="(author, index) in branch.authors" :key="index">
      <input :value="author" @input="onChangeAuthor(index, $event.target.value)" />
      <button @click="onRemoveAuthor(index)">Remove</button>
    </div>
    <button @click="onAddAuthor">Add</button>
  </div>
</template>

<script>
import { BranchMixin } from "vue-data-branch";

export default {
  mixins: [BranchMixin],
  branch: {
    root: "blog",
    path: "editor.article",
    keys: ["authors"],
  },
  methods: {
    onChangeAuthor(index, value) {
      this.$set(this.branch.authors, index, value);
    },
    onRemoveAuthor(index) {
      this.branch.authors = this.branch.authors.splice(index, 1);
    },
    onAddAuthor() {
      this.branch.authors.push("");
    },
  },
};
</script>
