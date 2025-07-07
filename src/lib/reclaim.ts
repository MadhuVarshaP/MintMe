import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk'

export async function createAndTriggerReclaimFlow({
  appId,
  appSecret,
  providerId,
  callbackUrl,
  options = {},
}: {
  appId: string
  appSecret: string
  providerId: string
  callbackUrl: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: Record<string, any>
}) {
  const reclaimProofRequest = await ReclaimProofRequest.init(
    appId,
    appSecret,
    providerId,
    options
  )
  reclaimProofRequest.setAppCallbackUrl(callbackUrl)
  // Optionally, you can customize modal/extension options here if needed
  const triggerResult = await reclaimProofRequest.triggerReclaimFlow()
  return { reclaimProofRequest, triggerResult }
} 