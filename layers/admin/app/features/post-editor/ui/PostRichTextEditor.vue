<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import FileHandler from '@tiptap/extension-file-handler'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'

const model = defineModel<string>({ default: '' })

const emit = defineEmits<{
  error: [message: string]
}>()

const api = useApi()
const toMediaUrl = useResolveMediaUrl()

const fileInputRef = ref<HTMLInputElement | null>(null)
const editorDragDepth = ref(0)
const isEditorDragOver = computed(() => editorDragDepth.value > 0)

async function uploadFile(file: File) {
  const body = new FormData()
  body.append('file', file)

  const result = await api<{ fileName: string }>('/files/upload', { method: 'POST', body })
  return `/assets/${result.fileName}`
}

async function insertImagesFromFiles(currentEditor: Editor, files: File[], pos?: number) {
  const imageFiles = files.filter((file) => file.type.startsWith('image/'))

  if (imageFiles.length === 0) {
    return
  }

  let insertPos = pos

  for (const file of imageFiles) {
    try {
      const path = await uploadFile(file)
      const src = toMediaUrl(path)

      if (typeof insertPos === 'number') {
        currentEditor
          .chain()
          .focus()
          .insertContentAt(insertPos, {
            type: 'image',
            attrs: { src }
          })
          .run()
        insertPos += 1
      } else {
        currentEditor.chain().focus().setImage({ src }).run()
      }
    } catch (error) {
      emit('error', getApiErrorMessage(error, 'Не удалось загрузить изображение'))
      break
    }
  }
}

const editor = useEditor({
  content: model.value,
  shouldRerenderOnTransaction: true,
  extensions: [
    StarterKit.configure({
      heading: { levels: [2, 3, 4] },
      link: false,
      underline: false
    }),
    Underline,
    Highlight.configure({ multicolor: false }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      HTMLAttributes: {
        rel: 'noopener noreferrer nofollow',
        target: '_blank'
      }
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    Image.configure({
      allowBase64: false,
      resize: {
        enabled: true,
        directions: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
        minWidth: 80,
        minHeight: 80,
        alwaysPreserveAspectRatio: true
      }
    }),
    Placeholder.configure({
      placeholder: 'Ну пиши…'
    }),
    FileHandler.configure({
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
      onDrop: (currentEditor, files, pos) => {
        void insertImagesFromFiles(currentEditor, files, pos)
      },
      onPaste: (currentEditor, files) => {
        void insertImagesFromFiles(currentEditor, files)
      }
    })
  ],
  editorProps: {
    attributes: {
      class: 'post-rich-editor__content prose max-w-none min-h-[320px] focus:outline-none px-1 py-2'
    }
  },
  onUpdate: ({ editor: currentEditor }) => {
    model.value = currentEditor.getHTML()
  }
})

watch(model, (value) => {
  if (!editor.value) {
    return
  }

  if (editor.value.getHTML() === value) {
    return
  }

  editor.value.commands.setContent(value || '', { emitUpdate: false })
})

function runCommand(callback: (currentEditor: Editor) => void) {
  if (!editor.value) {
    return
  }

  callback(editor.value)
}

function setHeading(level: 2 | 3 | 4) {
  editor.value?.chain().focus().toggleHeading({ level }).run()
}

function setParagraph() {
  editor.value?.chain().focus().setParagraph().run()
}

function setLink() {
  const previousUrl = editor.value?.getAttributes('link').href as string | undefined
  const url = window.prompt('URL ссылки', previousUrl ?? 'https://')

  if (url === null) {
    return
  }

  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function insertTable() {
  editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
}

function triggerImageUpload() {
  fileInputRef.value?.click()
}

async function onImagePicked(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file || !editor.value) {
    return
  }

  await insertImagesFromFiles(editor.value, [file])
  target.value = ''
}

function onEditorDragEnter(event: DragEvent) {
  if (event.dataTransfer?.types.includes('Files')) {
    editorDragDepth.value += 1
  }
}

function onEditorDragLeave() {
  editorDragDepth.value = Math.max(0, editorDragDepth.value - 1)
}

function resetEditorDragState() {
  editorDragDepth.value = 0
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="post-rich-editor space-y-2">
    <div
      class="post-rich-editor__toolbar flex flex-wrap gap-1 rounded-xl border border-base-300/60 bg-base-200/50 p-2 sticky top-[4.25rem] z-30 backdrop-blur-sm"
    >
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :disabled="!editor?.can().chain().focus().undo().run()"
        @click="editor?.chain().focus().undo().run()"
      >
        ↶
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :disabled="!editor?.can().chain().focus().redo().run()"
        @click="editor?.chain().focus().redo().run()"
      >
        ↷
      </button>

      <span class="divider divider-horizontal mx-0 w-px" />

      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive('heading', { level: 2 }) }"
        @click="setHeading(2)"
      >
        H2
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive('heading', { level: 3 }) }"
        @click="setHeading(3)"
      >
        H3
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive('heading', { level: 4 }) }"
        @click="setHeading(4)"
      >
        H4
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive('paragraph') }"
        @click="setParagraph"
      >
        P
      </button>

      <span class="divider divider-horizontal mx-0 w-px" />

      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive('bold') }"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        B
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs italic"
        :class="{ 'btn-active': editor?.isActive('italic') }"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        I
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs underline"
        :class="{ 'btn-active': editor?.isActive('underline') }"
        @click="editor?.chain().focus().toggleUnderline().run()"
      >
        U
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs line-through"
        :class="{ 'btn-active': editor?.isActive('strike') }"
        @click="editor?.chain().focus().toggleStrike().run()"
      >
        S
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive('highlight') }"
        @click="editor?.chain().focus().toggleHighlight().run()"
      >
        HL
      </button>

      <span class="divider divider-horizontal mx-0 w-px" />

      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive('link') }"
        @click="setLink"
      >
        Link
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :disabled="!editor?.isActive('link')"
        @click="editor?.chain().focus().unsetLink().run()"
      >
        Unlink
      </button>

      <span class="divider divider-horizontal mx-0 w-px" />

      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive({ textAlign: 'left' }) }"
        @click="editor?.chain().focus().setTextAlign('left').run()"
      >
        ⬅
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive({ textAlign: 'center' }) }"
        @click="editor?.chain().focus().setTextAlign('center').run()"
      >
        ↔
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive({ textAlign: 'right' }) }"
        @click="editor?.chain().focus().setTextAlign('right').run()"
      >
        ➡
      </button>

      <span class="divider divider-horizontal mx-0 w-px" />

      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive('bulletList') }"
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        • List
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive('orderedList') }"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        1. List
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive('blockquote') }"
        @click="editor?.chain().focus().toggleBlockquote().run()"
      >
        Quote
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :class="{ 'btn-active': editor?.isActive('codeBlock') }"
        @click="editor?.chain().focus().toggleCodeBlock().run()"
      >
        Code
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        @click="editor?.chain().focus().setHorizontalRule().run()"
      >
        HR
      </button>

      <span class="divider divider-horizontal mx-0 w-px" />

      <button type="button" class="btn btn-ghost btn-xs" @click="insertTable">Table</button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :disabled="!editor?.can().addColumnAfter()"
        @click="runCommand((e) => e.chain().focus().addColumnAfter().run())"
      >
        +Col
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :disabled="!editor?.can().addRowAfter()"
        @click="runCommand((e) => e.chain().focus().addRowAfter().run())"
      >
        +Row
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        :disabled="!editor?.can().deleteTable()"
        @click="runCommand((e) => e.chain().focus().deleteTable().run())"
      >
        Del table
      </button>

      <span class="divider divider-horizontal mx-0 w-px" />

      <button type="button" class="btn btn-ghost btn-xs" @click="triggerImageUpload">Image</button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        @click="editor?.chain().focus().clearNodes().unsetAllMarks().run()"
      >
        Clear
      </button>

      <input
        ref="fileInputRef"
        type="file"
        class="hidden"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
        @change="onImagePicked"
      />
    </div>

    <div
      class="post-rich-editor__surface border border-base-300/60 rounded-xl p-4 sm:p-5 bg-base-100 min-h-[280px] transition-colors"
      :class="{ 'border-primary bg-primary/5 ring-2 ring-primary/20': isEditorDragOver }"
      @dragenter.prevent="onEditorDragEnter"
      @dragover.prevent
      @dragleave="onEditorDragLeave"
      @drop="resetEditorDragState"
    >
      <p v-if="isEditorDragOver" class="text-sm text-primary mb-2">
        Отпустите изображение, чтобы добавить в контент
      </p>

      <ClientOnly>
        <EditorContent :editor="editor" />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
:deep(.post-rich-editor__content p.is-editor-empty:first-child::before) {
  color: color-mix(in oklch, var(--color-base-content) 45%, transparent);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.ProseMirror img) {
  display: block;
  max-width: 100%;
  height: auto;
}

:deep(.ProseMirror table) {
  border-collapse: collapse;
  margin: 1rem 0;
  overflow: hidden;
  table-layout: fixed;
  width: 100%;
}

:deep(.ProseMirror th),
:deep(.ProseMirror td) {
  border: 1px solid color-mix(in oklch, var(--color-base-content) 20%, transparent);
  box-sizing: border-box;
  min-width: 80px;
  padding: 0.5rem 0.75rem;
  position: relative;
  vertical-align: top;
}

:deep(.ProseMirror th) {
  background: var(--color-base-200);
  font-weight: 600;
}

:deep(.ProseMirror blockquote) {
  border-left: 4px solid var(--color-primary);
  margin: 1rem 0;
  padding-left: 1rem;
}

:deep(.ProseMirror pre) {
  background: var(--color-base-200);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
}

:deep(.ProseMirror [data-resize-handle]) {
  width: 10px;
  height: 10px;
  background: var(--color-primary);
  border: 2px solid white;
  border-radius: 9999px;
  box-shadow: 0 0 0 1px color-mix(in oklch, var(--color-primary) 40%, transparent);
}

:deep(.ProseMirror [data-resize-state='true']) {
  outline: 2px solid color-mix(in oklch, var(--color-primary) 35%, transparent);
  outline-offset: 2px;
}
</style>
