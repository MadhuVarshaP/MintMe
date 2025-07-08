"use client";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";

export default function ReclaimVerification() {
  const [requestUrl, setRequestUrl] = useState("");
  const [proofs, setProofs] = useState<boolean | null>(null);

  useEffect(() => {
    const getVerificationReq = async () => {
      try {
        // 1. Fetch config from backend
        const response = await fetch("/api/generate-config");
        const { reclaimProofRequestConfig } = await response.json();

        // 2. Initialize ReclaimProofRequest
        const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(reclaimProofRequestConfig);

        // 3. Generate request URL
        const url = await reclaimProofRequest.getRequestUrl();
        setRequestUrl(url);

        // 4. Start session (optional: you can start on button click instead)
        await reclaimProofRequest.startSession({
          onSuccess: () => {
            setProofs(true);
          },
          onError: (error) => {
            alert("Verification failed: " + error.message);
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          alert("Error initializing Reclaim: " + error.message);
        } else {
          alert("Error initializing Reclaim: " + String(error));
        }
      }
    };

    getVerificationReq();
  }, []);

  return (
    <div>
      <h2>Verify your GitHub with Reclaim</h2>
      {requestUrl ? (
        <div>
          <QRCode value={requestUrl} size={180} />
          <br />
          <a href={requestUrl} target="_blank" rel="noopener noreferrer">
            Or click here if you&apos;re on desktop
          </a>
        </div>
      ) : (
        <div>Loading verification link...</div>
      )}
      {proofs && (
        <div>
          <h2>Verification Successful!</h2>
          <pre>{JSON.stringify(proofs, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}