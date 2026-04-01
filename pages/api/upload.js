import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { base64, fileName, userId } = req.body
    const buffer = Buffer.from(base64, 'base64')
    const path = `${userId}/${Date.now()}_${fileName}`

    const { error } = await supabase.storage
      .from('cigar-images')
      .upload(path, buffer, { contentType: 'image/jpeg', upsert: false })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('cigar-images')
      .getPublicUrl(path)

    res.status(200).json({ url: publicUrl })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Upload failed' })
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
}
