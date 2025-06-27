
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'

const APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APP_ID!
const APP_SECRET = process.env.RECLAIM_SECRET!
const PROVIDER_ID = process.env.NEXT_PUBLIC_RECLAIM_PROOF_TEMPLATE_ID!
const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID)

    reclaimProofRequest.setAppCallbackUrl(`${BASE_URL}/api/receive-proofs`)

    const config = reclaimProofRequest.toJsonString()

    return res.status(200).json({ reclaimProofRequestConfig: config })
  } catch (error) {
    console.error('Error generating proof config:', error)
    return res.status(500).json({ error: 'Failed to generate config' })
  }
}
