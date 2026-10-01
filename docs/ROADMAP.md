# Roadmap

## V1 - control plane
- [x] Worker HTTP service
- [x] token authentication
- [x] KV project registry
- [x] GitHub repository validation
- [x] workflow trigger and run status
- [x] basic live URL inspection
- [x] install/architecture/product docs
- [ ] MCP transport and tools
- [ ] Browser Rendering binding and visual actions
- [ ] deployment URL synchronization from Cloudflare/GitHub

## V1.1 - AI observation loop
- screenshot
- DOM/accessibility extraction
- click/type/navigate
- console/network failures where Browser Rendering supports them
- acceptance checks

## V2 - platform mode
- Workers for Platforms dispatch namespace
- deploy user Workers by API
- wildcard/custom hostname router
- per-project isolation and limits
- logs/observability aggregation

## V3 - heavy runtime
Only if needed: Containers/Sandbox adapter for repositories requiring a full Linux runtime.