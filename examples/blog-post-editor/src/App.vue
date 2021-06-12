<template>
  <div id="app">
    <edit-title />
    <edit-content />
    <edit-authors />
    <preview-article />
  </div>
</template>

<script>
import EditAuthors from "./components/EditAuthors.vue";
import EditContent from "./components/EditContent.vue";
import EditTitle from "./components/EditTitle.vue";

import PreviewArticle from "./components/PreviewArticle.vue";

export default {
  components: {
    EditAuthors,
    EditContent,
    EditTitle,
    PreviewArticle,
  },
};
</script>

