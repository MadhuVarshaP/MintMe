import { verifyProof } from '@reclaimprotocol/js-sdk'
import { NextRequest, NextResponse } from 'next/server'
import PinataClient from '@pinata/sdk'

const pinata = new PinataClient({
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY!
});

export async function POST(req: NextRequest) {
  try {
    // Parse the form data (Reclaim sends proof as the key, value is usually "1" or empty)
    const formData = await req.formData();
    const entries = Array.from(formData.entries());
    if (entries.length === 0) {
      return NextResponse.json({ error: 'No proof data received' }, { status: 400 });
    }
    const [proofKey] = entries[0];
    console.log('Received proofKey:', proofKey);

    let proof;
    try {
      const decoded = decodeURIComponent(proofKey);
      console.log('Decoded body:', decoded);
      proof = JSON.parse(decoded);
      console.log('Parsed proof:', proof);
    } catch (e) {
      return NextResponse.json({ error: 'Malformed proof data' }, { status: 400 });
    }

    // Defensive: check for expected proof structure
    if (!proof || !Array.isArray(proof.proofs)) {
      return NextResponse.json({ error: 'Invalid proof structure' }, { status: 400 });
    }
    if (!proof.proofs[0] || !Array.isArray(proof.proofs[0].claims)) {
      return NextResponse.json({ error: 'Missing claims in proof' }, { status: 400 });
    }

    // Verify the proof using the SDK
    const isValid = await verifyProof(proof);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid proofs data' }, { status: 400 });
    }

    // Extract GitHub info (customize as needed)
    const claims = proof.proofs[0].claims;
    const stars = Number(claims.find((c: any) => c.claimType === "GitHub Stars")?.value || 0);
    const repos = Number(claims.find((c: any) => c.claimType === "GitHub Public Repos")?.value || 0);
    const username = claims.find((c: any) => c.claimType === "GitHub Username")?.value || 'unknown';
    const name = claims.find((c: any) => c.claimType === "Full Name")?.value || 'GitHub Verified Resume';
    const reputationScore = (stars * 0.5) + (repos * 2);

    // Prepare metadata for IPFS
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
    };

    // Upload to IPFS via Pinata
    const result = await pinata.pinJSONToIPFS(resumeMetadata, {
      pinataMetadata: { name: 'resume-v1.json' }
    });

    // Respond with the IPFS hash and URL
    return NextResponse.json({
      message: 'Proof verified and resume uploaded',
      username,
      reputationScore,
      ipfsHash: result.IpfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({
      error: 'Verification or upload failed',
      details: err.message
    }, { status: 500 });
  }
}

// import { verifyProof } from '@reclaimprotocol/js-sdk'
// import { NFTStorage, File } from 'nft.storage'
// import { NextRequest, NextResponse } from 'next/server'

// // Validate NFT Storage token early
// const nftStorageToken = process.env.NFT_STORAGE_TOKEN?.trim()
// if (!nftStorageToken || nftStorageToken.length < 20) {
//   console.error('Invalid NFT_STORAGE_TOKEN configuration')
//   // This will fail fast if the token is invalid
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// function extractGitHubInfo(proof: any) {
//   console.log('Extracting GitHub info from proof structure:', JSON.stringify(proof, null, 2))
  
//   // Handle the nested proof structure - claims are in proof.proofs[0].claims
//   let claims = []
//   if (proof.proofs && proof.proofs.length > 0 && proof.proofs[0].claims) {
//     claims = proof.proofs[0].claims
//   } else if (proof.claims) {
//     claims = proof.claims
//   } else {
//     console.error('No claims found in proof structure')
//     return { stars: 0, repos: 0, username: 'unknown', name: 'GitHub Verified Resume' }
//   }
  
//   console.log('Found claims:', claims)
  
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const stars = Number(claims.find((c: any) => c.claimType === "GitHub Stars")?.value || 0)
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const repos = Number(claims.find((c: any) => c.claimType === "GitHub Public Repos")?.value || 0)
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const username = claims.find((c: any) => c.claimType === "GitHub Username")?.value || 'unknown'
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const name = claims.find((c: any) => c.claimType === "Full Name")?.value || 'GitHub Verified Resume'

//   return { stars, repos, username, name }
// }
// export async function POST(req: NextRequest) {
//   try {
//     console.log('Received request to /receive-proofs')
    
//     // Validate NFT.Storage token before processing
//     if (!nftStorageToken) {
//       throw new Error('NFT_STORAGE_TOKEN is not configured')
//     }

//     // Step 1: Get raw body text
//     const rawBody = await req.text()
//     console.log('Raw body received:', rawBody)
    
//     // Step 2: Parse the proof data
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     let proof: any
//     try {
//       proof = JSON.parse(rawBody)
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (e) {
//       try {
//         const decoded = decodeURIComponent(rawBody)
//         proof = JSON.parse(decoded)
//       } catch (decodeError) {
//         console.error('Failed to parse proof data:', decodeError)
//         return NextResponse.json(
//           { error: 'Invalid proof format', details: 'Could not parse as JSON or URL-encoded JSON' },
//           { status: 400 }
//         )
//       }
//     }
    
//     console.log('Parsed proof:', proof)

//     // Step 3: Verify the proof
//     try {
//       const isValid = await verifyProof(proof)
//       if (!isValid) {
//         console.error('Proof verification failed')
//         return NextResponse.json(
//           { error: 'Invalid proof', details: 'Proof verification failed' },
//           { status: 400 }
//         )
//       }
//       console.log('Proof verified successfully')
//     } catch (verifyError) {
//       console.error('Proof verification error:', verifyError)
//       return NextResponse.json(
//         { error: 'Verification error', details: String(verifyError) },
//         { status: 400 }
//       )
//     }

//     // Step 4: Extract GitHub metrics
//     const { stars, repos, username, name } = extractGitHubInfo(proof)
//     const reputationScore = (stars * 0.5) + (repos * 2)
    
//     console.log('Extracted GitHub info:', { username, stars, repos, name, reputationScore })

//     // Step 5: Create IPFS metadata
//     const resumeMetadata = {
//       name,
//       description: 'GitHub-verified onchain resume',
//       attributes: [
//         { trait_type: 'Username', value: username },
//         { trait_type: 'Stars', value: stars },
//         { trait_type: 'Repos', value: repos },
//         { trait_type: 'Reputation Score', value: reputationScore },
//         { trait_type: 'Version', value: 'v1' },
//         { trait_type: 'Timestamp', value: Date.now() }
//       ],
//       proof
//     }

//     // Step 6: Upload to IPFS with better error handling
//     console.log('Uploading to IPFS...')
//     try {
//       const client = new NFTStorage({ token: nftStorageToken })
      
//       // Validate client connection
//       if (!client) throw new Error('Failed to initialize NFT.Storage client')
      
//       const blob = new Blob([JSON.stringify(resumeMetadata)], { type: 'application/json' })
//       const file = new File([blob], 'resume-v1.json', { type: 'application/json' })
//       const cid = await client.storeBlob(file)
      
//       console.log('Successfully uploaded to IPFS with CID:', cid)

//       // Step 7: Send success response
//       const responseData = {
//         message: 'Proof verified and resume uploaded',
//         username,
//         reputationScore,
//         cid,
//         ipfsUrl: `https://ipfs.io/ipfs/${cid}`,
//       }
      
//       return NextResponse.json(responseData, { status: 200 })
//     } catch (ipfsError) {
//       console.error('IPFS Upload Error:', ipfsError)
//       return NextResponse.json({
//         error: 'IPFS upload failed',
//         details: ipfsError instanceof Error ? ipfsError.message : String(ipfsError)
//       }, { status: 500 })
//     }
    
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     console.error('Reclaim Proof Handling Error:', err)
//     return NextResponse.json({
//       error: 'Verification or upload failed',
//       details: err.message
//     }, { status: 500 })
//   }
// }