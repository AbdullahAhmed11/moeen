const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('invalid_type'))
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      reject(new Error('too_large'))
      return
    }

    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('read_failed'))
    reader.readAsDataURL(file)
  })
}
