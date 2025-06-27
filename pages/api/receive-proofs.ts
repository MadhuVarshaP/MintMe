
import { verifyProof } from '@reclaimprotocol/js-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'

// Needed to parse large text payloads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const decodedBody = decodeURIComponent(req.body as string)
    const proof = JSON.parse(decodedBody)

    const result = await verifyProof(proof)

    if (!result) {
      return res.status(400).json({ error: 'Invalid proof received' })
    }

    console.log('✅ Reclaim GitHub proof verified:', proof)

    // TODO: Here you can:
    // - extract GitHub data
    // - calculate Dev Score
    // - upload resume metadata to IPFS
    // - return result to frontend if needed

    return res.status(200).json({ message: 'Proof verified', proof })
  } catch (err) {
    console.error('❌ Error verifying Reclaim proof:', err)
    return res.status(500).json({ error: 'Verification failed' })
  }
}
