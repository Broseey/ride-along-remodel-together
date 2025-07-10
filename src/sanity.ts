// src/sanity.ts
import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'iizakh7l', // replace this
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
})
