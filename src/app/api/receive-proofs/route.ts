import { verifyProof } from '@reclaimprotocol/js-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const entries = Array.from(formData.entries());

    // Find the first key that looks like a proof (should be a long URL-encoded string)
    const proofEntry = entries.find(([key]) => {
      return key.startsWith('%7B') || key.startsWith('{');
    });

    if (!proofEntry) {
      return NextResponse.json({ error: 'Proof not found in form data' }, { status: 400 });
    }

    const [proofKey] = proofEntry;
    let proof;
    try {
      const decoded = decodeURIComponent(proofKey);
      proof = JSON.parse(decoded);
      console.log('Decoded proof object:', proof);
    } catch {
      return NextResponse.json({ error: 'Malformed proof data' }, { status: 400 });
    }

    // Accept both single-proof and multi-proof formats
    const isMultiProof = proof && Array.isArray(proof.proofs);
    const isSingleProof = proof && proof.signatures && proof.claimData;

    if (!isMultiProof && !isSingleProof) {
      return NextResponse.json({ error: 'Invalid proof structure' }, { status: 400 });
    }

    // Verify the proof using the SDK (works for both formats)
    const isValid = await verifyProof(proof);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid proofs data' }, { status: 400 });
    }

    // (Optional) Process/store the proof as needed here

    return NextResponse.json({ message: 'Proof verified' }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      error: 'Verification or upload failed',
      details: errorMessage
    }, { status: 500 });
  }
}