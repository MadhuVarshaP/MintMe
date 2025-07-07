import { verifyProof } from '@reclaimprotocol/js-sdk'
import { NFTStorage, File } from 'nft.storage'
import { NextRequest, NextResponse } from 'next/server'

// ✅ Load your NFT.Storage token from environment
const nftStorageToken = process.env.NFT_STORAGE_TOKEN!

// ✅ Configure max body size if needed
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
}

// ✅ Utility function to extract fields from proof
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractGitHubInfo(proof: any) {
  const data = proof.claimData || proof.publicData || {}
  return {
    username: data.username || data.login || 'unknown',
    stars: Number(data.stars || data.starCount || 0),
    repos: Number(data.repos || data.repoCount || 0),
    name: data.name || 'GitHub Verified Resume',
  }
}

// ✅ Main handler
export async function POST(req: NextRequest) {
  try {
    // Step 1: Decode the Reclaim proof body (sent as URL-encoded string)
    const rawBody = await req.text()
    const decoded = decodeURIComponent(rawBody)
    const proof = JSON.parse(decoded)

    // Step 2: Verify authenticity
    const isValid = await verifyProof(proof)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid proof: signature check failed' }, { status: 400 })
    }

    // Step 3: Extract GitHub claim data
    const { username, stars, repos, name } = extractGitHubInfo(proof)

    // Step 4: Compute your reputation score formula
    const reputationScore = (stars * 0.5) + (repos * 2)

    // Step 5: Build the metadata object for resume
    const resumeMetadata = {
      name,
      attributes: {
        username,
        stars,
        repos,
        reputationScore,
      },
      proof,
    }

    // Step 6: Upload to IPFS via nft.storage
    const client = new NFTStorage({ token: nftStorageToken })
    const blob = new Blob([JSON.stringify(resumeMetadata)], { type: 'application/json' })
    const file = new File([blob], 'resume.json', { type: 'application/json' })
    const cid = await client.storeBlob(file)

    // Step 7: Send success response
    return NextResponse.json({
      message: 'Proof verified and resume uploaded',
      username,
      reputationScore,
      cid,
      ipfsUrl: `https://ipfs.io/ipfs/${cid}`,
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('❌ Failed to handle Reclaim proof:', err)
    return NextResponse.json({ error: 'Verification or upload failed', details: err.message }, { status: 500 })
  }
}
