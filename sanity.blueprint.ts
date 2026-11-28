import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    // defineDocumentFunction({name: 'my-function', event: {on: ['create', 'update']}}),
    defineDocumentFunction({ name: 'dhidroid-labs-read', event: { on: ['create', 'update'] } }),

  ],
})