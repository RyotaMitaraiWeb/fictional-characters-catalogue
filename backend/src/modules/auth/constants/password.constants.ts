export const passwordValidationRules = {
  minLength: 6,
};

type key = keyof typeof passwordValidationRules;

export const passwordValidationErrors: Record<key, string> = {
  minLength: `The password must be at least ${passwordValidationRules.minLength} characters long`,
};
