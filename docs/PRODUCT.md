# GPT-Deploy Product Specification

## Goal
GPT-Deploy is a self-hostless preview/deployment control plane for AI-assisted web development. The human should only need the final URL. ChatGPT/Codex can modify GitHub, trigger a deployment, inspect the live result, iterate, and return the finished URL.

## Primary flow
1. Register a GitHub repository.
2. Push code through the normal GitHub workflow.
3. Cloudflare Workers Builds/Previews builds the repository.
4. GPT-Deploy reads deployment status and URL.
5. AI inspects the public preview and, when Browser Rendering is enabled, interacts with it.
6. AI fixes code and repeats until acceptance checks pass.

## V1 scope
- Cloudflare Worker control plane.
- Bearer-token protected API.
- Project registry in Workers KV.
- GitHub workflow dispatch/status adapter.
- HTTP/HTML inspection.
- MCP endpoint/tool layer (planned in Phase 2 of implementation).
- Cloudflare Browser Rendering adapter (planned in Phase 2).
- Documentation for Workers Builds and Worker Previews.

## Non-goals
- Clone every Railway feature.
- Billing, teams, regions, Kubernetes.
- Hosting arbitrary long-running OS processes in the control-plane Worker.

## Runtime strategy
Prefer native Cloudflare Workers/Static Assets for compatible apps. Use Workers for Platforms/Dynamic Dispatch when GPT-Deploy itself needs to host many generated Worker applications. Use Containers/Sandbox only for workloads that truly require a Linux process/runtime.

## Definition of done
A repository can be registered, deployed through a standard workflow, observed through a public preview URL, inspected by AI, and promoted by the user's chosen Git/Cloudflare workflow without a personal server.