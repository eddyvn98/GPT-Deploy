# GPT-Deploy

AI-first deployment and preview control plane running on Cloudflare.

GPT-Deploy is designed for this loop:

```
ChatGPT/Codex -> GitHub -> Cloudflare Preview -> inspect/test -> fix -> redeploy -> final URL
```

The control plane itself needs no VPS, Docker, Windows service, reverse proxy, or Cloudflare Tunnel. It runs as a Cloudflare Worker. Target apps normally use Cloudflare Workers Builds/Previews; Workers for Platforms is the planned multi-project hosting mode, and Containers/Sandbox is reserved for apps that truly need a full Linux runtime.

## Current V1

- Cloudflare Worker API
- bearer-token authentication
- KV project registry
- GitHub repo validation
- GitHub Actions deployment trigger/status
- public URL HTTP/HTML inspection
- lightweight MCP endpoint with project/deploy/inspect tools
- CI typecheck/tests

Full visual browser actions are the next adapter and should use Cloudflare Browser Rendering, not a local Chromium process.

## Documentation

- [Product specification](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Install on Cloudflare](docs/INSTALL.md)
- [Target repository contract](docs/TARGET_REPO.md)
- [HTTP API](docs/API.md)
- [Roadmap](docs/ROADMAP.md)

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars
npm run dev
```

## Deploy

Create KV and secrets as described in docs/INSTALL.md, replace KV IDs in wrangler.jsonc, then:

```bash
npm run deploy
```

## MCP endpoint

POST JSON-RPC requests to `/mcp` using the same bearer token as the API. Supported tools in V1: `list_projects`, `register_project`, `deploy_project`, `deployment_runs`, and `inspect_url`.

> Status: V1 foundation. Do not treat arbitrary repositories as automatically Worker-compatible; use Containers/Sandbox for workloads that require OS processes or native binaries.
