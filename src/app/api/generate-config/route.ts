import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk'
import { NextResponse } from 'next/server'

const APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APP_ID!
const APP_SECRET = process.env.RECLAIM_SECRET!
const BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000'
const PROVIDER_IDS = process.env.NEXT_PUBLIC_RECLAIM_PROOF_TEMPLATE_IDS!.split(',').map(id => id.trim())
const PROVIDER_ID = PROVIDER_IDS[0] // Use the first provider ID for now 

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();
    if (!walletAddress) {
      return NextResponse.json({ error: 'Missing walletAddress in request body' }, { status: 400 });
    }
    console.log('Initializing ReclaimProofRequest...')
    console.log("Provider IDs received:", PROVIDER_IDS)
    console.log("Using Provider ID:", PROVIDER_ID)
    console.log("App ID:", APP_ID)
    console.log("Base URL:", BASE_URL)
    console.log("Wallet Address:", walletAddress);

    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID, { 
      useAppClip: true, // default: true
      log: true, // default: false
      useBrowserExtension: true, // default: true
      extensionID: 'reclaim-extension' // default: 'reclaim-extension'
    })

    reclaimProofRequest.setAppCallbackUrl(`${BASE_URL}/api/receive-proofs`)
    reclaimProofRequest.setModalOptions({
      title: 'Verify GitHub Account',
      description: 'Scan this QR code with the Reclaim app',
      darkTheme: true,
      extensionUrl: 'https://chrome.google.com/webstore/detail/reclaim',
      showExtensionInstallButton: true,
      modalPopupTimer: 2,
    })
    // Set the wallet address in the context (not supported by SDK, so this is commented out)
    // reclaimProofRequest.setContext({ walletAddress });
    // If SDK supports, use:
    // reclaimProofRequest.setContextString(JSON.stringify({ walletAddress }));
    reclaimProofRequest.setRedirectUrl(`${BASE_URL}/verification-complete`)
    const requestUrl = await reclaimProofRequest.getRequestUrl()
    console.log('ReclaimProofRequest ready.')
    return NextResponse.json({
      reclaimUrl: requestUrl,
      reclaimProofRequestConfig: reclaimProofRequest.toJsonString(),
    })
  } catch (error: unknown) {
    console.error('Error generating Reclaim config:', error)
    return NextResponse.json({
      error: 'Failed to initialize ReclaimProofRequest',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
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
