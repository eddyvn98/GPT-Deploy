# Installation on Cloudflare

No VPS, Windows service, Docker, Caddy, Nginx or Cloudflare Tunnel is required for the control plane.

## Prerequisites
- GitHub account with access to target repositories.
- Cloudflare account.
- Node.js only on the machine used for initial setup, or use Cloudflare's Git integration after bootstrap.

## 1. Clone and install
```bash
git clone https://github.com/eddyvn98/GPT-Deploy.git
cd GPT-Deploy
npm install
```

## 2. Create KV
```bash
npx wrangler kv namespace create STATE
npx wrangler kv namespace create STATE --preview
```
Copy the returned IDs into wrangler.jsonc.

## 3. Configure secrets
```bash
npx wrangler secret put ADMIN_TOKEN
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put CLOUDFLARE_API_TOKEN
npx wrangler secret put CLOUDFLARE_ACCOUNT_ID
```
Use a long random ADMIN_TOKEN. Prefer fine-grained GitHub and Cloudflare tokens.

## 4. Deploy
```bash
npm run deploy
```
Verify GET /health on the workers.dev URL.

## 5. Connect GitHub to Cloudflare
In Cloudflare Workers & Pages, import/connect the GPT-Deploy repository. Configure production deploy command as `npx wrangler deploy`. For branch testing use Worker Previews (`npx wrangler preview`) on current Wrangler releases.

## 6. Custom domain (optional)
Attach a custom domain such as deploy.example.com in Cloudflare. This is direct Worker routing; Tunnel is unnecessary.

## Target app setup
For each app, either connect its repo directly to Workers Builds/Previews or add .github/workflows/gpt-deploy.yml from docs/TARGET_REPO.md. The control plane currently triggers that workflow by name.

## First API call
```bash
curl -X POST https://YOUR_DEPLOY_HOST/api/projects \\
  -H 'Authorization: Bearer YOUR_ADMIN_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{"repo":"eddyvn98/BuildMate"}'
```