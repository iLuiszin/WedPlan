import { revalidatePath } from 'next/cache';
import { AppError, ErrorCode } from '@/types/error-codes';
import { logger } from './logger';
import { connectToDatabase } from './db';
import type { ActionResponse } from '@/types/action-response';
import type { ZodSchema } from 'zod';

type ActionFunction<TInput, TOutput> = (input: TInput) => Promise<TOutput>;

interface ActionOptions {
  revalidate?: string | string[];
  operationName?: string;
}

interface ValidatedActionOptions<TInput> extends ActionOptions {
  schema: ZodSchema<TInput>;
}

export const withAction = <TInput, TOutput>(
  actionFunction: ActionFunction<TInput, TOutput>,
  options?: ActionOptions
) => {
  return async (input: TInput): Promise<ActionResponse<TOutput>> => {
    try {
      await connectToDatabase();
      const data = await actionFunction(input);

      if (options?.revalidate) {
        const paths = Array.isArray(options.revalidate)
          ? options.revalidate
          : [options.revalidate];

        paths.forEach((path) => revalidatePath(path));
      }

      return { success: true, data };
    } catch (error) {
      if (error instanceof AppError) {
        logger.error(
          `${options?.operationName || 'Action'} failed with AppError`,
          error,
          { input }
        );
        return {
          success: false,
          error: error.message,
          code: error.code,
        };
      }

      logger.error(
        `${options?.operationName || 'Action'} failed with unexpected error`,
        error as Error,
        { input }
      );
      return {
        success: false,
        error: 'An unexpected error occurred',
        code: ErrorCode.DB_ERROR,
      };
    }
  };
};

export const withValidatedAction = <TInput, TOutput>(
  actionFunction: ActionFunction<TInput, TOutput>,
  options: ValidatedActionOptions<TInput>
) => {
  return async (rawInput: unknown): Promise<ActionResponse<TOutput>> => {
    const parsed = options.schema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid input',
        code: ErrorCode.VALIDATION_ERROR,
      };
    }

    return withAction(actionFunction, options)(parsed.data);
  };
};
