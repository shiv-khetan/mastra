import { describe, expectTypeOf, it } from 'vitest';
import { BatchPartsProcessor, ProcessorStepSchema, TokenLimiterProcessor } from '../processors';
import type { Processor } from '../processors';
import type { ProcessorStepInputType, ProcessorStepOutputType } from '../processors/step-schema';
import { createWorkflow } from './create';
import { createStep } from './workflow';

describe('Processor workflows', () => {
  // Processor steps must share a flat boundary type so .then() accepts the previous output (#27577).
  it('chains token limiting and batched guardrails from ProcessorStepSchema', () => {
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
    expectTypeOf<ProcessorStepInputType>().toExtend<ProcessorStepOutputType>();
  });

  it('chains object-literal input and output processors', () => {
    const input = {
      id: 'tag-input',
      async processInput({ messages }) {
        return messages;
      },
    } satisfies Processor<'tag-input'>;
    const output = {
      id: 'tag-output',
      async processOutputResult({ messages }) {
        return messages;
      },
    } satisfies Processor<'tag-output'>;

    const workflow = createWorkflow({
      id: 'object-literal-processors',
      inputSchema: ProcessorStepSchema,
      outputSchema: ProcessorStepSchema,
    })
      .then(createStep(input))
      .then(createStep(output))
      .then(createStep(input))
      .commit();

    expectTypeOf(workflow.id).toEqualTypeOf<'object-literal-processors'>();
  });
});
