# Claude Code Instructions

## Start Here

Read `AGENTS.md` before making changes. Follow its project conventions and requirements throughout the task.

## Working with RiserBob

This project uses RiserBob, Bun, and TypeScript.

- Inspect the existing implementation before using a framework API.
- Follow the APIs and patterns actually present in the project.
- Do not assume RiserBob behaves like Express, NestJS, or another framework.
- Do not invent methods, decorators, route registration patterns, or configuration options.
- Consult the installed package's types and the existing source code when API behavior is unclear.

## Editing Rules

- Keep changes focused on the user's request.
- Preserve the existing architecture and public interfaces.
- Avoid unrelated file changes and unnecessary rewrites.
- Prefer explicit TypeScript types and avoid `any`.
- Do not add dependencies without a clear need.
- Never overwrite user changes without inspecting them first.

## Verification

Before finishing:

1. Review the changes you made.
2. Run relevant tests using the project's configured commands.
3. Run the build if a build script exists and is relevant.
4. Fix issues caused by your changes when possible.
5. Report exactly which checks passed and which were not run.

Never claim successful verification without executing the corresponding command.

## Communication

Explain important implementation decisions concisely. Mention affected files, verification results, and any unresolved issues.
