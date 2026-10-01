export interface Env {
  STATE: KVNamespace;
  ADMIN_TOKEN: string;
  GITHUB_TOKEN: string;
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  GITHUB_OWNER: string;
  PREVIEW_SUFFIX: string;
  TEAM_DOMAIN?: string;
  POLICY_AUD?: string;
  ACCESS_BYPASS_LOCAL?: string;
}

export type Project = {
  id:string; repo:string; branch:string; slug:string;
  createdAt:string; updatedAt:string; deploymentUrl?:string;
  status:"created"|"deploying"|"ready"|"failed"; lastError?:string;
};
