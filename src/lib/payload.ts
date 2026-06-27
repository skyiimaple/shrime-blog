import config from '@payload-config'
import { getPayload } from 'payload'

type PayloadClient = Awaited<ReturnType<typeof getPayload>>

declare global {
  // eslint-disable-next-line no-var
  var __payloadClient: PayloadClient | undefined
  // eslint-disable-next-line no-var
  var __payloadPromise: Promise<PayloadClient> | undefined
}

export async function getPayloadClient() {
  if (global.__payloadClient) {
    return global.__payloadClient
  }

  if (!global.__payloadPromise) {
    global.__payloadPromise = getPayload({ config })
  }

  global.__payloadClient = await global.__payloadPromise
  return global.__payloadClient
}
