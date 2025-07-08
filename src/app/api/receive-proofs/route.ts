import { verifyProof } from '@reclaimprotocol/js-sdk'
import { NFTStorage, File } from 'nft.storage'
import { NextRequest, NextResponse } from 'next/server'

const nftStorageToken = process.env.NFT_STORAGE_TOKEN!

// Utility: Extract GitHub data from Reclaim claims
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractGitHubInfo(proof: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stars = Number(proof.claims.find((c: any) => c.claimType === "GitHub Stars")?.value || 0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const repos = Number(proof.claims.find((c: any) => c.claimType === "GitHub Public Repos")?.value || 0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const username = proof.claims.find((c: any) => c.claimType === "GitHub Username")?.value || 'unknown'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const name = proof.claims.find((c: any) => c.claimType === "Full Name")?.value || 'GitHub Verified Resume'

  return { stars, repos, username, name }
}

export async function POST(req: NextRequest) {
  try {
    // Step 1: Parse raw JSON body from Reclaim
    const proof = await req.json()
    console.log('Received Reclaim Proof:', proof)

    // Step 2: Verify the signature
    const isValid = await verifyProof(proof)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid proof: verification failed' }, { status: 400 })
    }

    // Step 3: Extract GitHub metrics
    const { stars, repos, username, name } = extractGitHubInfo(proof)
    const reputationScore = (stars * 0.5) + (repos * 2)

    // Step 4: Create IPFS metadata
    const resumeMetadata = {
      name,
      description: 'GitHub-verified onchain resume',
      attributes: [
        { trait_type: 'Username', value: username },
        { trait_type: 'Stars', value: stars },
        { trait_type: 'Repos', value: repos },
        { trait_type: 'Reputation Score', value: reputationScore },
        { trait_type: 'Version', value: 'v1' },
        { trait_type: 'Timestamp', value: Date.now() }
      ],
      proof
    }

    // Step 5: Upload to IPFS
    const client = new NFTStorage({ token: nftStorageToken })
    const blob = new Blob([JSON.stringify(resumeMetadata)], { type: 'application/json' })
    const file = new File([blob], 'resume-v1.json', { type: 'application/json' })
    const cid = await client.storeBlob(file)

    // Step 6: Send response
    return NextResponse.json({
      message: 'Proof verified and resume uploaded',
      username,
      reputationScore,
      cid,
      ipfsUrl: `https://ipfs.io/ipfs/${cid}`,
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Reclaim Proof Handling Error:', err)
    return NextResponse.json({
      error: 'Verification or upload failed',
      details: err.message
    }, { status: 500 })
  }
}
