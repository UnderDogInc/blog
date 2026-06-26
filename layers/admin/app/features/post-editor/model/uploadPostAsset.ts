import { validatePostImageFile } from './validatePostImage'

export async function uploadPostAsset(api: ReturnType<typeof useApi>, file: File) {
  const validationError = validatePostImageFile(file)

  if (validationError) {
    throw new Error(validationError)
  }

  const body = new FormData()
  body.append('file', file)

  const result = await api<{ fileName: string }>('/files/upload', { method: 'POST', body })
  return `/assets/${result.fileName}`
}
