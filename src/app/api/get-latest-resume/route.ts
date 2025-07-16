export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || "mintme";

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId query parameter' }, { status: 400 });
  }

  try {
    const db = await getDb();
    const latestProof = await db.collection("proofs")
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    if (!latestProof[0]) {
      return NextResponse.json({ error: 'No proof found for user' }, { status: 404 });
    }

    const ipfsHash = latestProof[0].ipfsHash;
    // Fetch the proof JSON from Pinata public gateway
    const proofRes = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    if (!proofRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch proof from Pinata', status: proofRes.status }, { status: 502 });
    }
    const proof = await proofRes.json();
    const publicData = proof.publicData || {};
    const resume = {
      name: publicData.username || 'Unknown',
      title: 'Web3 Developer',
      location: 'India',
      experience: '3+ years',
      skills: ['Solidity', 'React', 'Node.js', 'TypeScript', 'Web3'],
      projects: [
        { name: 'DeFi Dashboard', stars: 234 },
        { name: 'NFT Marketplace', stars: 189 },
        { name: 'Web3 Wallet', stars: 156 },
      ],
      followers: publicData.followers,
      creationYear: publicData.creationYear,
      contributionsLastYear: publicData.contributionsLastYear,
    };
    return NextResponse.json({ resume });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch or parse proof from Pinata', details: String(err) }, { status: 500 });
  }
} 