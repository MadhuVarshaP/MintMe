export const runtime = "nodejs";
import { verifyProof } from '@reclaimprotocol/js-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { uploadJsonToPinata } from '@/lib/pinata';
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || 'mintme';
let client: MongoClient;
let db: Db;
export async function getDb() {
  if (!client || !db) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

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

    // Upload the verified proof to Pinata and store in MongoDB
    try {
      const pinataRes = await uploadJsonToPinata(proof);
      // Use GitHub username as userId
      const userId = proof.publicData?.username;
      if (!userId) {
        return NextResponse.json({ error: 'No username found in proof publicData' }, { status: 400 });
      }
      const db = await getDb();
      await db.collection('proofs').insertOne({
        userId,
        ipfsHash: pinataRes.IpfsHash,
        timestamp: new Date(),
      });
      return NextResponse.json({ message: 'Proof verified and uploaded', ipfsHash: pinataRes.IpfsHash, pinataRes });
    } catch (uploadErr) {
      return NextResponse.json({ error: 'Proof verified but failed to upload to Pinata or DB', details: String(uploadErr) }, { status: 500 });
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      error: 'Verification or upload failed',
      details: errorMessage
    }, { status: 500 });
  }
}