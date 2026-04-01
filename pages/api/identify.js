export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { messages, hasImage } = req.body

  const system = hasImage
    ? `You are a cigar expert. When given an image of a cigar band or packaging, identify the cigar and return ONLY a JSON object with no markdown, no explanation, no backticks. Return exactly this structure:
{"name":"full cigar name","brand":"brand name","origin":"country of origin","wrapper":"wrapper leaf origin/type","binder":"binder leaf","filler":"filler blend","strength":"Mild/Medium/Full","size":"vitola and dimensions if known","confidence":"high/medium/low"}
If you cannot identify it, still return the JSON with empty strings and confidence "low".`
    : `You are a cigar expert database. Return ONLY a JSON object with no markdown, no explanation, no backticks:
{"name":"full cigar name","brand":"brand name","origin":"country of origin","wrapper":"wrapper leaf origin/type","binder":"binder leaf","filler":"filler blend","strength":"Mild/Medium/Full","size":"common vitola"}
If unknown, use empty strings.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1000,
        system,
        messages,
      }),
    })

    const data = await response.json()
    const text = data.content?.find(b => b.type === 'text')?.text || '{}'
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    res.status(200).json(parsed)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Identification failed' })
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
}
