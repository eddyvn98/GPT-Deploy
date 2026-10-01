# HTTP API

All /api routes require `Authorization: Bearer <ADMIN_TOKEN>`.

- GET /health - public health check.
- GET /api/projects - list projects.
- POST /api/projects - register {repo, branch?, slug?}.
- GET /api/projects/:id - project metadata.
- POST /api/projects/:id/deploy - dispatch target repo workflow `gpt-deploy.yml`.
- GET /api/projects/:id/runs - latest workflow runs.
- POST /api/projects/:id/inspect - fetch deployment URL or body {url} and return HTTP/HTML diagnostics.

V1 deliberately keeps API small. MCP tools will wrap these same domain operations rather than duplicate deployment logic.