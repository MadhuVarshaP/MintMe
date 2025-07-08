// import { verifyProof } from '@reclaimprotocol/js-sdk'
// import { NFTStorage, File } from 'nft.storage'
// import { NextRequest, NextResponse } from 'next/server'

// const nftStorageToken = process.env.NFT_STORAGE_TOKEN!

// // Utility: Extract GitHub data from Reclaim claims
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
    
//     // Step 1: Parse URL-encoded form data from Reclaim (as per documentation)
//     const formData = await req.formData()
//     console.log('Form data entries:', Array.from(formData.entries()))
    
//     // Build body object from form data
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const body: Record<string, any> = {}
//     for (const [key, value] of formData.entries()) {
//       body[key] = value
//     }
//     console.log('Processed body:', body)
    
//     // Parse the proof from the first key (as per Reclaim docs)
//     const proofKey = Object.keys(body)[0]
//     if (!proofKey) {
//       console.error('No proof data found in form')
//       return NextResponse.json({ error: 'No proof data received' }, { status: 400 })
//     }
    
//     // Decode and parse the proof
//     const decodedBody = decodeURIComponent(proofKey)
//     console.log('Decoded body:', decodedBody)
    
//     const proof = JSON.parse(decodedBody)
//     console.log('Parsed Reclaim Proof:', proof)

//     // Step 2: Verify the proof using the SDK verifyProof function
//     console.log('About to verify proof with structure:', {
//       hasProofs: !!proof.proofs,
//       proofsLength: proof.proofs?.length,
//       hasSignature: !!proof.signature,
//       hasSignedMessage: !!proof.signedMessage,
//       hasAppId: !!proof.appId
//     })
    
//     try {
//       // Try different approaches to verify the proof
//       let verificationSuccessful = false
      
//       // Approach 1: Try verifying the entire proof object
//       try {
//         console.log('Attempting to verify entire proof object...')
//         const isValid = await verifyProof(proof)
//         if (isValid) {
//           console.log('Entire proof verification successful!')
//           verificationSuccessful = true
//         } else {
//           console.log('Entire proof verification returned false')
//         }
//       } catch (error) {
//         console.log('Entire proof verification failed with error:', error)
//       }
      
//       // Approach 2: Try verifying individual proofs if the first approach failed
//       if (!verificationSuccessful && proof.proofs && proof.proofs.length > 0) {
//         console.log('Attempting to verify individual proofs...')
//         try {
//           let allValid = true
//           for (const individualProof of proof.proofs) {
//             console.log('Verifying individual proof with keys:', Object.keys(individualProof))
//             const isValid = await verifyProof(individualProof)
//             if (!isValid) {
//               allValid = false
//               console.error('Individual proof verification failed')
//             }
//           }
//           if (allValid) {
//             console.log('All individual proof verifications successful!')
//             verificationSuccessful = true
//           }
//         } catch (error) {
//           console.log('Individual proof verification failed with error:', error)
//         }
//       }
      
//       // For now, continue processing even if verification fails (for debugging)
//       if (!verificationSuccessful) {
//         console.warn('Proof verification failed, but continuing for debugging purposes...')
//         // Uncomment the line below when you want to enforce verification
//         // return NextResponse.json({ error: 'Invalid proofs data' }, { status: 400 })
//       }
      
//     } catch (verifyError) {
//       console.error('Unexpected error during proof verification:', verifyError)
//       console.log('Continuing with processing despite verification error...')
//     }

//     // Step 3: Extract GitHub metrics
//     const { stars, repos, username, name } = extractGitHubInfo(proof)
//     const reputationScore = (stars * 0.5) + (repos * 2)
    
//     console.log('Extracted GitHub info:', { username, stars, repos, name, reputationScore })

//     // Step 4: Create IPFS metadata
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

//     // Step 5: Upload to IPFS
//     console.log('Uploading to IPFS...')
//     const client = new NFTStorage({ token: nftStorageToken })
//     const blob = new Blob([JSON.stringify(resumeMetadata)], { type: 'application/json' })
//     const file = new File([blob], 'resume-v1.json', { type: 'application/json' })
//     const cid = await client.storeBlob(file)
    
//     console.log('Successfully uploaded to IPFS with CID:', cid)

//     // Step 6: Send success response (return 200 as per Reclaim docs)
//     const responseData = {
//       message: 'Proof verified and resume uploaded',
//       username,
//       reputationScore,
//       cid,
//       ipfsUrl: `https://ipfs.io/ipfs/${cid}`,
//     }
    
//     console.log('Sending response:', responseData)
//     return NextResponse.json(responseData, { status: 200 })
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     console.error('Reclaim Proof Handling Error:', err)
//     return NextResponse.json({
//       error: 'Verification or upload failed',
//       details: err.message
//     }, { status: 500 })
//   }
// }


import { verifyProof } from '@reclaimprotocol/js-sdk'
import { NFTStorage, File } from 'nft.storage'
import { NextRequest, NextResponse } from 'next/server'

const nftStorageToken = process.env.NFT_STORAGE_TOKEN!

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractGitHubInfo(proof: any) {
  console.log('Extracting GitHub info from proof structure:', JSON.stringify(proof, null, 2))
  
  // Handle the nested proof structure - claims are in proof.proofs[0].claims
  let claims = []
  if (proof.proofs && proof.proofs.length > 0 && proof.proofs[0].claims) {
    claims = proof.proofs[0].claims
  } else if (proof.claims) {
    claims = proof.claims
  } else {
    console.error('No claims found in proof structure')
    return { stars: 0, repos: 0, username: 'unknown', name: 'GitHub Verified Resume' }
  }
  
  console.log('Found claims:', claims)
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stars = Number(claims.find((c: any) => c.claimType === "GitHub Stars")?.value || 0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const repos = Number(claims.find((c: any) => c.claimType === "GitHub Public Repos")?.value || 0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const username = claims.find((c: any) => c.claimType === "GitHub Username")?.value || 'unknown'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const name = claims.find((c: any) => c.claimType === "Full Name")?.value || 'GitHub Verified Resume'

  return { stars, repos, username, name }
}

export async function POST(req: NextRequest) {
  try {
    console.log('Received request to /receive-proofs')
    
    // Step 1: Get raw body text (Reclaim sends URL-encoded JSON)
    const rawBody = await req.text()
    console.log('Raw body received:', rawBody)
    
    // Step 2: Parse the proof data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let proof: any
    try {
      // First try parsing as direct JSON
      proof = JSON.parse(rawBody)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // If that fails, try URL decoding first
      try {
        const decoded = decodeURIComponent(rawBody)
        proof = JSON.parse(decoded)
      } catch (decodeError) {
        console.error('Failed to parse proof data:', decodeError)
        return NextResponse.json(
          { error: 'Invalid proof format', details: 'Could not parse as JSON or URL-encoded JSON' },
          { status: 400 }
        )
      }
    }
    
    console.log('Parsed proof:', proof)

    // Step 3: Verify the proof
    try {
      const isValid = await verifyProof(proof)
      if (!isValid) {
        console.error('Proof verification failed')
        return NextResponse.json(
          { error: 'Invalid proof', details: 'Proof verification failed' },
          { status: 400 }
        )
      }
      console.log('Proof verified successfully')
    } catch (verifyError) {
      console.error('Proof verification error:', verifyError)
      return NextResponse.json(
        { error: 'Verification error', details: String(verifyError) },
        { status: 400 }
      )
    }

    // Step 4: Extract GitHub metrics
    const { stars, repos, username, name } = extractGitHubInfo(proof)
    const reputationScore = (stars * 0.5) + (repos * 2)
    
    console.log('Extracted GitHub info:', { username, stars, repos, name, reputationScore })

    // Step 5: Create IPFS metadata
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

    // Step 6: Upload to IPFS
    console.log('Uploading to IPFS...')
    const client = new NFTStorage({ token: nftStorageToken })
    const blob = new Blob([JSON.stringify(resumeMetadata)], { type: 'application/json' })
    const file = new File([blob], 'resume-v1.json', { type: 'application/json' })
    const cid = await client.storeBlob(file)
    
    console.log('Successfully uploaded to IPFS with CID:', cid)

    // Step 7: Send success response
    const responseData = {
      message: 'Proof verified and resume uploaded',
      username,
      reputationScore,
      cid,
      ipfsUrl: `https://ipfs.io/ipfs/${cid}`,
    }
    
    console.log('Sending response:', responseData)
    return NextResponse.json(responseData, { status: 200 })
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Reclaim Proof Handling Error:', err)
    return NextResponse.json({
      error: 'Verification or upload failed',
      details: err.message
    }, { status: 500 })
  }
}