import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ruleService } from '@/services/ruleService';

// Create a tRPC instance with error formatting
const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        errorDetails: error.cause instanceof Error ? error.cause.message : undefined,
      },
    };
  },
});

// Export the router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Create the root router
export const appRouter = router({
  getRules: publicProcedure.query(async () => {
    try {
      const rules = await ruleService.findAll();
      return rules;
    } catch (error) {
      console.error('Error in tRPC getRules:', error);
      throw new Error('Failed to fetch rules');
    }
  }),

  getRuleById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const rule = await ruleService.findById(input.id);
    return rule;
  }),

  createRule: publicProcedure
    .input(
      z.object({
        priority: z.number().int().positive(),
        urlFilter: z.string().min(1),
        resourceTypes: z.array(z.string()).min(1),
        requestMethods: z.array(z.string()),
        actionType: z.string().min(1),
        redirectUrl: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const rule = await ruleService.create(input);
      return rule;
    }),
});

// Export type definition of API
export type AppRouter = typeof appRouter;
