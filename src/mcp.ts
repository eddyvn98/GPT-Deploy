import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import type { Env, Project } from "./types";
import { getProject, listProjects, putProject } from "./store";
import { dispatchDeploy, repoInfo, workflowRuns } from "./github";
import { inspectUrl } from "./browser";

const text = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
});

export function createMcpServer(env: Env) {
  const server = new McpServer({ name: "gpt-deploy", version: "0.1.1" });

  server.registerTool("list_projects", {
    description: "List projects registered in GPT-Deploy",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false },
  }, async () => text(await listProjects(env)));

  server.registerTool("register_project", {
    description: "Register a GitHub repository",
    inputSchema: { repo: z.string().min(3), branch: z.string().optional(), slug: z.string().optional() },
    annotations: { readOnlyHint: false, destructiveHint: false },
  }, async ({ repo, branch, slug }) => {
    const info = await repoInfo(env, repo);
    const id = (slug || repo.split("/").pop() || "app").toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const now = new Date().toISOString();
    const project: Project = {
      id, repo, branch: branch || info.default_branch || "main", slug: id,
      createdAt: now, updatedAt: now, status: "created",
    };
    return text(await putProject(env, project));
  });

  server.registerTool("deploy_project", {
    description: "Trigger the target repository gpt-deploy.yml workflow",
    inputSchema: { id: z.string().min(1) },
    annotations: { readOnlyHint: false, destructiveHint: false },
  }, async ({ id }) => {
    const project = await getProject(env, id);
    if (!project) throw new Error("project not found");
    await dispatchDeploy(env, project.repo, project.branch);
    project.status = "deploying";
    await putProject(env, project);
    return text(project);
  });

  server.registerTool("deployment_runs", {
    description: "Get recent deployment workflow runs",
    inputSchema: { id: z.string().min(1) },
    annotations: { readOnlyHint: true, destructiveHint: false },
  }, async ({ id }) => {
    const project = await getProject(env, id);
    if (!project) throw new Error("project not found");
    return text(await workflowRuns(env, project.repo, project.branch));
  });

  server.registerTool("inspect_url", {
    description: "Inspect a public web URL over HTTP",
    inputSchema: { url: z.string().url() },
    annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
  }, async ({ url }) => text(await inspectUrl(url)));

  return server;
}
