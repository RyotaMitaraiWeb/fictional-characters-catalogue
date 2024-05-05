export const usernameValidationRules = {
  minLength: 5,
  maxLength: 20,
  pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/gm,
};

type key = keyof typeof usernameValidationRules;

export const usernameValidationErrors: Record<key, string> = {
  minLength: `The username should be at least ${usernameValidationRules.minLength} characters long`,
  maxLength: `The username should be no longer than ${usernameValidationRules.maxLength} characters`,
  pattern:
    'The username may consist only of numbers, English characters, and underscores. It also cannot start with a number',
};
