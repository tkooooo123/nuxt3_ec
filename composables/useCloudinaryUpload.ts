export async function useCloudinaryUpload(file: File): Promise<string> {
  const config = useRuntimeConfig()

  try {
    const CLOUD_NAME = config.public.cloudinary.cloudName
    const UPLOAD_PRESET = config.public.cloudinary.uploadReset

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error('缺少 Cloudinary 的雲端名稱或上傳預設參數')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error?.message || 'Cloudinary 上傳失敗')
    }

    return data.secure_url
  } catch (error: unknown) {
    if(error instanceof Error) {
    throw new Error(`Cloudinary 上傳失敗: ${error.message || error}`)
    } else {
      throw new Error('Cloudinary 上傳失敗')
    }
  }
}

// 新增：依次上傳多張圖片
export async function useCloudinaryUploadMultiple(
  files: File[]
): Promise<string[]> {
  const config = useRuntimeConfig()

  try {
    const CLOUD_NAME = config.public.cloudinary.cloudName
    const UPLOAD_PRESET = config.public.cloudinary.uploadReset

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error('缺少 Cloudinary 的雲端名稱或上傳預設參數')
    }

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', UPLOAD_PRESET)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error?.message || 'Cloudinary 上傳失敗')
      }

      return data.secure_url
    })

    // 依次上傳，等待每張圖片上傳完成
    const results: string[] = []
    for (let i = 0; i < uploadPromises.length; i++) {
      try {
        const url = await uploadPromises[i]
        results.push(url)
      } catch (error: unknown) {
        if(error instanceof Error) 
        throw new Error(`第 ${i + 1} 張圖片上傳失敗: ${error.message}`)
      }
    }

    return results
  } catch (error: unknown) {
    if(error instanceof Error) {
    throw new Error(`多張圖片上傳失敗: ${error.message || error}`)
    } else {
      throw new Error('多張圖片上傳失敗')
    }
  }
}
