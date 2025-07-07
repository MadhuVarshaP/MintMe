import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk'
import { NextResponse } from 'next/server'

const APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APP_ID!
const APP_SECRET = process.env.RECLAIM_SECRET!
const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000'
const PROVIDER_IDS = process.env.NEXT_PUBLIC_RECLAIM_PROOF_TEMPLATE_IDS!.split(',').map(id => id.trim())
const PROVIDER_ID = PROVIDER_IDS[0] // Use the first provider ID for now 

export async function GET() {
  try {
    console.log('Initializing ReclaimProofRequest...')
    console.log("Provider IDs received:", PROVIDER_IDS)
    console.log("Using Provider ID:", PROVIDER_ID)
    console.log("App ID:", APP_ID)
    console.log("Base URL:", BASE_URL)

    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID, { 
    useAppClip: true, // default: true
    log: true, // default: false
    useBrowserExtension: true, // default: true
    extensionID: 'reclaim-extension' // default: 'reclaim-extension'
  })

    console.log('Setting callback URL...')
    reclaimProofRequest.setAppCallbackUrl(`${BASE_URL}/api/receive-proofs`)

    console.log('Generating request URL...')
    const requestUrl = await reclaimProofRequest.getRequestUrl()

    reclaimProofRequest.setAppCallbackUrl(`${BASE_URL}/api/receive-proofs`)

    // Make sure to set this before starting the verification session.
    reclaimProofRequest.setRedirectUrl(`${BASE_URL}/verification-complete`)


    console.log('ReclaimProofRequest ready.')
    return NextResponse.json({
      reclaimUrl: requestUrl,
      reclaimProofRequestConfig: reclaimProofRequest.toJsonString(),
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error generating Reclaim config:', error)
    return NextResponse.json({
      error: 'Failed to initialize ReclaimProofRequest',
      message: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
