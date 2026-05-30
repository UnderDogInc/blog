<script setup lang="ts">
import { usePostEditorForm } from '../model/usePostEditorForm'
import PostEditorContentSection from './PostEditorContentSection.vue'
import PostEditorHeader from './PostEditorHeader.vue'
import PostEditorMainSection from './PostEditorMainSection.vue'
import PostEditorPreviewSection from './PostEditorPreviewSection.vue'
import PostEditorSeoSection from './PostEditorSeoSection.vue'
import PostEditorSubmitBar from './PostEditorSubmitBar.vue'

const props = withDefaults(
  defineProps<{
    mode: 'create' | 'edit'
    postId?: number
  }>(),
  {
    postId: undefined
  }
)

const {
  form,
  isEdit,
  loading,
  deleting,
  submitError,
  submitSuccess,
  validationErrors,
  previewUploading,
  previewDisplayUrl,
  categories,
  availableRecommendedPosts,
  setRecommendedPosts,
  setSubmitError,
  submit,
  remove,
  clearPreview,
  onPreviewPicked
} = usePostEditorForm({
  mode: props.mode,
  postId: props.postId
})
</script>

<template>
  <section class="space-y-6 pb-24">
    <PostEditorHeader
      :is-edit="isEdit"
      :title="form.title"
      :post-id="postId"
      :loading="loading"
      :deleting="deleting"
      @remove="remove"
    />

    <div v-if="submitError" class="alert alert-error rounded-2xl">
      <span>{{ submitError }}</span>
    </div>
    <div v-if="submitSuccess" class="alert alert-success rounded-2xl">
      <span>{{ submitSuccess }}</span>
    </div>

    <form class="space-y-6" @submit.prevent="submit">
      <PostEditorMainSection :form="form" :categories="categories" :errors="validationErrors" />

      <PostEditorPreviewSection
        :form="form"
        :preview-display-url="previewDisplayUrl"
        :preview-uploading="previewUploading"
        :errors="validationErrors"
        @preview-picked="onPreviewPicked"
        @clear-preview="clearPreview"
      />

      <PostEditorSeoSection
        :form="form"
        :recommended-posts="availableRecommendedPosts"
        @recommended-change="setRecommendedPosts"
      />

      <PostEditorContentSection
        v-model:content="form.content"
        :error="validationErrors.content"
        @error="setSubmitError"
      />

      <PostEditorSubmitBar :is-edit="isEdit" :loading="loading" :deleting="deleting" />
    </form>
  </section>
</template>
