export type AccountUserType = "user" | "independent-consultant" | "agency-consultant";

// Replace this temporary selector with the authenticated user's backend role.
export const currentAccountUserType: AccountUserType = "independent-consultant";
