import type { FormValidateInput } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import type { ZodType } from "zod";

export function zodValidate<T>(schema: ZodType): FormValidateInput<T> {
  return zod4Resolver(
    schema as ZodType<Record<string, unknown>>,
  ) as unknown as FormValidateInput<T>;
}
