# GPT-Deploy Product Specification

## Goal
GPT-Deploy is a serverless preview/deployment control plane for AI-assisted web development. The human should only need the final URL. ChatGPT/Codex can modify GitHub, trigger deployment, inspect the live result, iterate, and return the finished URL.

## Primary flow
1. Register a GitHub repository.
2. Push code through the normal GitHub workflow.
3. Cloudflare Workers Builds/Previews builds the repository.
4. GPT-Deploy reads deployment status and URL.
5. AI inspects the public preview and, when Browser Rendering is enabled, interacts with it.
6. AI fixes code and repeats until acceptance checks pass.

## Implemented V1 foundation
- Cloudflare Worker control plane.
- REST API protected by an admin token.
- Project registry in Workers KV.
- GitHub workflow dispatch/status adapter.
- HTTP/HTML inspection.
- MCP server using Cloudflare's Streamable HTTP handler.
- Cloudflare Access JWT validation hook for MCP.
- CI typecheck/test/Worker dry-run.

## Still required before production use
- Configure Cloudflare Access Managed OAuth on the deployed MCP endpoint.
- Add Browser Rendering for visual interaction.
- Synchronize Cloudflare preview/deployment URLs automatically.
- Perform an end-to-end deployment against a real target repository.

## Non-goals
Billing, teams, Kubernetes, or running arbitrary long-lived OS processes inside the control-plane Worker.
