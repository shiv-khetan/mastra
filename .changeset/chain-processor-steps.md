---
'@mastra/core': patch
'@mastra/inngest': patch
---

Fixed a TypeScript error when chaining processor steps with `.then()`. Workflows that run several processors in a row, like the output guardrails example in the docs, now type-check without casts or `@ts-expect-error`. Fixes [#27577](https://github.com/mastra-ai/mastra/issues/27577).

```ts
const outputGuardrails = createWorkflow({
  id: 'output-guardrails',
  inputSchema: ProcessorStepSchema,
  outputSchema: ProcessorStepSchema,
})
  .then(createStep(new TokenLimiterProcessor({ limit: 1000 })))
  .then(createStep(new BatchPartsProcessor())) // previously failed with TS2345
  .commit();
```
