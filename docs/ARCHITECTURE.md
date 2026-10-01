# Architecture

## Control plane
GPT-Deploy runs as a Cloudflare Worker. KV stores project metadata. Secrets contain GitHub and Cloudflare credentials.

## Deployment plane
Two modes are intentionally separated:

### Mode A - GitHub + Workers Builds/Previews (default)
Best for the user's own repositories. GitHub remains source of truth. Cloudflare builds on push and exposes preview/deployment URLs. This is the simplest path and requires no server.

### Mode B - Workers for Platforms (future platform mode)
A dispatch namespace holds generated/user Workers. A dynamic dispatch Worker maps hostname/path to a user Worker. This is appropriate when GPT-Deploy becomes a true multi-project hosting platform rather than an orchestrator around existing repos.

## Browser observation
Basic inspection uses fetch and reports status, final URL, title, content type and an HTML sample. Full visual interaction must use Cloudflare Browser Rendering; do not attempt to spawn local Chromium from the Worker.

## Security
- All /api routes require ADMIN_TOKEN.
- GitHub token should be fine-grained to selected repositories.
- Cloudflare API token should have only required Worker permissions.
- Never expose tokens to deployed applications.
- Generated/untrusted code must not execute inside the control-plane Worker.

## Data model
Project: id, repo, branch, slug, status, deploymentUrl, timestamps, lastError.

## Scaling
KV is sufficient for V1 metadata. If transactional state, audit history, users or queues become important, migrate metadata to D1 and deployment jobs to Queues/Workflows.