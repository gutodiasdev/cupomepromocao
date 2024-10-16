import { useMutation, UseMutationResult, UseMutationOptions } from "@tanstack/react-query";
import { z, ZodType } from "zod";

type Input<TSchema extends ZodType, TData, TError = Error> = {
  key: string;
  schema: TSchema;
  formData: z.infer<TSchema>;
  fn: (input: z.infer<TSchema>) => Promise<TData>;
} & Omit<UseMutationOptions<TData, TError, unknown>, 'mutationKey' | 'mutationFn'>; 

export const useFormMutation = <TSchema extends ZodType, TData = void, TError = Error>(
  input: Input<TSchema, TData, TError>
): UseMutationResult<TData, TError, unknown> => {
  return useMutation<TData, TError, unknown>({
    mutationKey: [input.key],
    mutationFn: async () => {
      const result = input.schema.safeParse(input.formData);
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }
      return await input.fn(input.formData);
    },
    ...input
  });
};
