import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Env } from "./types";

export async function requireAccess(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (local && env.ACCESS_BYPASS_LOCAL === "true") return null;

  if (!env.TEAM_DOMAIN || !env.POLICY_AUD) {
    return Response.json({ error: "Cloudflare Access is not configured for MCP" }, { status: 503 });
  }

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return Response.json({ error: "missing Cloudflare Access JWT" }, { status: 401 });

  try {
    const issuer = env.TEAM_DOMAIN.replace(/\/$/, "");
    const jwks = createRemoteJWKSet(new URL(issuer + "/cdn-cgi/access/certs"));
    await jwtVerify(token, jwks, { issuer, audience: env.POLICY_AUD });
    return null;
  } catch {
    return Response.json({ error: "invalid Cloudflare Access JWT" }, { status: 401 });
  }
}
