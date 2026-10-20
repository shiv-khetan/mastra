import { BatchPartsProcessor, ProcessorStepSchema, TokenLimiterProcessor } from '@mastra/core/processors';
import { Inngest } from 'inngest';
import { describe, expectTypeOf, it } from 'vitest';
import { createStep, init } from './index';

describe('Inngest processor workflows', () => {
  // Processor steps must share one input/output type so .then() accepts the previous output (#27577).
  it('chains token limiting and batched guardrails from ProcessorStepSchema', () => {
    const { createWorkflow } = init(new Inngest({ id: 'processor-step-chaining' }));
    const workflow = createWorkflow({
      id: 'output-guardrails',
      inputSchema: ProcessorStepSchema,
      outputSchema: ProcessorStepSchema,
    })
      .then(createStep(new TokenLimiterProcessor({ limit: 1000 })))
      .then(createStep(new BatchPartsProcessor()))
      .then(createStep(new TokenLimiterProcessor({ limit: 2000 })))
      .commit();

    expectTypeOf(workflow.id).toEqualTypeOf<'output-guardrails'>();
  });
});
