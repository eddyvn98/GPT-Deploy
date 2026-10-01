# Target repository contract

GPT-Deploy deliberately keeps target repositories conventional.

## Recommended: Cloudflare Git integration
Connect the target GitHub repository to a Cloudflare Worker and enable Worker Previews. Pushes/PRs are then built by Cloudflare automatically and receive preview/deployment URLs.

## Optional dispatch workflow
The current V1 API can trigger a workflow named `.github/workflows/gpt-deploy.yml`. A minimal example is:

```yaml
name: GPT Deploy
on:
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

For preview-first development, replace production deployment with the current Cloudflare Worker Preview command and capture its URL in CI. Keep production promotion explicit until the project is mature.

## App requirements
The app must be deployable on the selected Cloudflare runtime. Apps requiring arbitrary native binaries or persistent OS processes should use Cloudflare Containers/Sandbox instead of pretending they are ordinary Workers.