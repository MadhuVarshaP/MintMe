import PinataClient from '@pinata/sdk';

const pinataApiKey = process.env.PINATA_API_KEY!;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY!;

export const pinata = new PinataClient({ pinataApiKey, pinataSecretApiKey });

export async function uploadJsonToPinata(json: Record<string, unknown>) {
  const result = await pinata.pinJSONToIPFS(json);
  return result;
}
