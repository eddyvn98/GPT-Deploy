import { createMcpHandler } from "agents/mcp/server";
import { Hono } from "hono";
import type { Env } from "./types";
import { auth } from "./auth";
import { projects } from "./projects";
import { createMcpServer } from "./mcp";
import { requireAccess } from "./access";

const app = new Hono<{ Bindings: Env }>();
app.get("/", c => c.json({ name: "GPT-Deploy", version: "0.1.1", runtime: "Cloudflare Workers", status: "ok" }));
app.get("/health", c => c.json({ ok: true }));
app.use("/api/*", auth);
app.route("/api/projects", projects);
app.all("*", c => c.json({ error: "not found" }, 404));

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/mcp") {
      const denied = await requireAccess(request, env);
      if (denied) return denied;
      const handler = createMcpHandler(() => createMcpServer(env), { route: "/mcp" });
      return handler(request, env, ctx);
    }
    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
