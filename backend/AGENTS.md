
# AGENTS.md

## Project Overview

This project is built with RiserBob, a TypeScript HTTP framework powered by Bun.

Follow the existing project structure and conventions. Prefer simple, maintainable solutions over unnecessary abstractions.

## Technology Stack

- Runtime and package manager: Bun
- Language: TypeScript
- HTTP framework: RiserBob
- Tests: Bun's built-in test runner (`bun:test`)

Use Bun for installing dependencies, running scripts, and executing tests.

## Project Structure

- `src/index.ts`: Application entry point.
- `src/modules/`: Feature modules.
- `src/modules/users/`: Example Users module.
- `src/modules/users/users.controller.ts`: Controller logic.
- `src/modules/users/users.route.ts`: Route definitions.
- `src/modules/users/users.module.ts`: Module configuration.
- `src/modules/users/schemas/`: Data schemas.
- `src/modules/users/rules/`: Validation rules.

Follow the actual files in the repository if the structure changes.

## Development Rules

1. Inspect relevant files before making changes.
2. Follow existing RiserBob APIs and established project patterns.
3. Do not invent framework methods, decorators, middleware, or configuration options.
4. Use TypeScript types instead of `any` whenever possible.
5. Keep modules focused and responsibilities clearly separated.
6. Validate input at the appropriate application boundary.
7. Handle errors consistently with the existing application.
8. Avoid unrelated refactoring and unnecessary dependencies.
9. Preserve existing behavior unless the requested change requires otherwise.
10. Never claim that tests or builds passed unless they were actually executed.

## Commands

Check `package.json` before assuming a script exists.

Common commands may include:

- `bun install` — install dependencies.
- `bun run dev` — start the development server.
- `bun run build` — build the project, if configured.
- `bun test` — run tests.

Use only commands supported by the current project configuration.

## Testing

- Use `bun:test` for unit tests.
- Test observable behavior, not just whether methods exist.
- Include success cases, failure cases, and relevant edge cases.
- Run the relevant tests after modifying code when possible.
- Report any tests that could not be executed.

## Dependencies and Security

- Avoid adding dependencies when existing tools are sufficient.
- Never hardcode secrets, tokens, or credentials.
- Validate untrusted input.
- Do not weaken authentication, authorization, or validation to make tests pass.

## Final Response

When completing a task, summarize:

1. What changed.
2. Which files were affected.
3. Which tests or build commands were actually run.
4. Any remaining limitations or follow-up work.
