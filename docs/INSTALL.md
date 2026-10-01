# Installation on Cloudflare

The GPT-Deploy control plane needs no VPS, Windows service, Docker, Caddy, Nginx, or Cloudflare Tunnel.

## Prerequisites
- GitHub account with access to target repositories.
- Cloudflare account.
- A Cloudflare Zero Trust team if ChatGPT will connect to the private MCP endpoint.

## 1. Install
```bash
git clone https://github.com/eddyvn98/GPT-Deploy.git
cd GPT-Deploy
npm install
```

## 2. Create KV
```bash
npx wrangler kv namespace create STATE
```
Copy the namespace ID into `wrangler.jsonc`. Use a separate development namespace ID for `preview_id`.

## 3. Configure Worker secrets
```bash
npx wrangler secret put ADMIN_TOKEN
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put CLOUDFLARE_API_TOKEN
npx wrangler secret put CLOUDFLARE_ACCOUNT_ID
```
Use a fine-grained GitHub token restricted to repositories GPT-Deploy may operate on.

## 4. Deploy the Worker
```bash
npm run deploy
```
Verify `GET /health`.

## 5. Protect /mcp with Cloudflare Access Managed OAuth
Create a Cloudflare Access application for the GPT-Deploy Worker/custom domain and enable Managed OAuth for the MCP client flow. Configure the allowed identity/users in Access.

Set these Worker secrets/variables:
- `TEAM_DOMAIN`: for example `https://your-team.cloudflareaccess.com`
- `POLICY_AUD`: the Access application AUD tag.

GPT-Deploy validates the `Cf-Access-Jwt-Assertion` before passing requests to the MCP Streamable HTTP handler. `ACCESS_BYPASS_LOCAL=true` is only for localhost development and must not be enabled publicly.

## 6. Connect target repositories
The current deployment tool triggers `.github/workflows/gpt-deploy.yml`. See [TARGET_REPO.md](TARGET_REPO.md). Alternatively use Cloudflare's native Git integration and Worker Previews, then add deployment URL synchronization in the next implementation phase.

## 7. ChatGPT connection
After the public HTTPS endpoint and Access Managed OAuth are configured, use the MCP URL:

```
https://deploy.example.com/mcp
```

Do not give ChatGPT the REST `ADMIN_TOKEN`; it is only for direct administrative API calls.

## Production-readiness boundary
CI currently validates dependency installation, TypeScript, tests, and `wrangler deploy --dry-run`. Before calling the system production-ready, complete one real Cloudflare deployment, one authenticated ChatGPT MCP connection, and one target-repository deployment.
