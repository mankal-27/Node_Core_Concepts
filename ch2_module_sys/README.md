# Chapter 2: The Module System

Notes and experiments on JavaScript and Node.js modules, following *Node.js Design Patterns* (Casciaro & Mammino).

## Why Modules Matter

Modules are the basic unit of code organisation in Node.js. They give us:

- **Encapsulation**: hide internals, expose only a public API.
- **Reuse**: share code across files and projects (including via npm).
- **Dependency management**: dependencies are explicit (`import`), not implicit globals.
- **Namespacing**: no shared global scope, so no name collisions between files.

JavaScript originally had no module system (only `<script>` tags sharing one global scope). That led to several solutions over time:

| Style | Syntax | Where |
|-------|--------|-------|
| Revealing Module pattern (IIFE) | closures | Pre-ES6 browsers |
| CommonJS (CJS) | `require()` / `module.exports` | Node.js original |
| ES Modules (ESM) | `import` / `export` | Standard JS, browsers + Node.js |

This repo uses ESM (`"type": "module"` in the root [package.json](../package.json)).

## Files in This Chapter

| File | Demonstrates |
|------|--------------|
| [ex1.js](ex1.js) | **Revealing Module pattern**: an IIFE returns only the public API; `privateFoo`/`privateBar` are unreachable from outside (`undefined`). This is the idea every later module system formalises. |
| [Logger.js](Logger.js) | **Named exports**: a function, a constant, an object and a class exported from one module. |
| [ex2.js](ex2.js) | **Named imports vs namespace import**: `import { log, Logger }` and `import * as loggerModule`. |
| [ex3.js](ex3.js) | **Module specifiers** via `import.meta.resolve()`: relative, core (`node:assert`), and third-party (`node_modules`) resolution. |
| [main.js](main.js) + `strings-{en,es,el}.js` | **Dynamic `import()`**: load a language module at runtime based on `process.argv[2]`. |
| [counter.js](counter.js) + [ex4.js](ex4.js) | **Live bindings**: importers see updates, but cannot reassign an import. |
| [ex5.js](ex5.js) + [db.js](db.js) | **Default export, module cache (singleton)**, and the ESM replacement for `__dirname`. |
| [ex6.js](ex6.js) | **CJS/ESM interop** (`createRequire`, default import of CJS) and **monkey patching** a shared module. |
| [circular-cjs/](circular-cjs) | **Circular dependency in CommonJS**: partially loaded exports. |
| [circular-esm/](circular-esm) | **Circular dependency in ESM**: live bindings and the TDZ trap. |
| [ts/](ts) | **TypeScript**: `import type`, interfaces, dependency injection. |

Run any of them with:

```bash
node ex2.js
node main.js en      # also: es, el
node circular-cjs/main.cjs
node circular-esm/main.js
node ts/main.ts      # Node 22.18+/24+ strips types natively; no tsc needed
```

## Key Concepts

### 1. Revealing Module pattern (`ex1.js`)
Functions create scope in JS, so an IIFE gives us private state. We return an object holding only what should be public. Node.js modules apply the same idea: each file is its own scope, and `export` decides what leaks out.

### 2. Named exports and imports (`Logger.js`, `ex2.js`)
- `export` makes a binding public; everything else stays private to the file.
- Imports are **live read-only bindings**, not copies. If the exporter changes an exported `let`, importers see the update. (CJS `require` returns a copy of the value at call time.)
- Named exports give consumers a stable, statically analysable API, which enables tree-shaking and better tooling.

### 3. Module specifiers (`ex3.js`)
The string after `from` is resolved differently depending on its form:

- `./utils/example.js`: **relative** path. ESM requires the full file extension.
- `assert` / `node:assert`: **core module**. Prefer the `node:` prefix to make it obvious it is built in and cannot be shadowed by an npm package.
- `fastify/lib/logger.js`: **bare specifier**, resolved by walking up `node_modules`.

### 4. Dynamic import (`main.js`)
`import()` returns a Promise, so it can run conditionally, at runtime, with a computed path. It is the ESM answer to the dynamic `require()`. Top-level `await` (ESM only) lets `main.js` use it without a wrapper function.

Always validate the input first (as `main.js` does with `SUPPORTED_LANGUAGES`) before building an import path from user input.

## ESM vs CommonJS: Quick Comparison

| | CommonJS | ESM |
|---|----------|-----|
| Syntax | `require` / `module.exports` | `import` / `export` |
| Loading | Synchronous | Asynchronous (static analysis first) |
| Bindings | Copy of exported value | Live read-only binding |
| Strict mode | Opt in | Always on |
| Top-level `await` | No | Yes |
| `__dirname`, `__filename` | Available | Not available (use `import.meta.url`) |
| File extension in path | Optional | Required |
| Dynamic loading | `require(expr)` | `await import(expr)` |

## How This Affects the Design Patterns Ahead

The module system is the foundation the book's patterns are built on:

- **Encapsulation and information hiding**: modules are the first line of defence. Export a small surface area; keep helpers private.
- **Singleton**: modules are cached after first load, so exporting an instance (`export const db = new Db()`) gives a de facto singleton. Caveat: duplicates can occur if the same package resolves to different paths (e.g. two versions in `node_modules`).
- **Factory / Dependency Injection**: export a function that builds and configures an object instead of a hard-wired instance. This makes code testable and avoids tight coupling between modules.
- **Plugin / Strategy loading**: dynamic `import()` selects an implementation at runtime (like the language files in `main.js`).
- **Circular dependencies**: ESM resolves them through live bindings, but you can still hit uninitialised values. Prefer to break cycles by extracting shared code.
- **Wiring and state**: because imports are shared and cached, mutable module-level state is shared by every importer. Treat it deliberately.

## Circular Dependencies

A circular dependency is when `a` imports `b` and `b` imports `a` (directly or through a longer chain). The loader cannot finish either first, so what you see depends on the module system.

### CommonJS: partially loaded exports ([circular-cjs/](circular-cjs))

`require()` runs the file and returns `module.exports`. On a cycle, the second module receives whatever the first has exported *so far*.

Result of `node circular-cjs/main.cjs`:

```
a.loaded: true | a.b.loaded: true
b.loaded: true | b.a.loaded: false   <- b got a's stale, incomplete object
```

`a` later does `module.exports = {...}`, which replaces the object `b` already holds. The classic fix is to mutate `exports` (`exports.x = ...`) instead of reassigning, or to `require()` lazily inside the function that needs it.

### ESM: live bindings ([circular-esm/](circular-esm))

ESM loads in three phases: **parse** (build the dependency graph), **instantiate** (create bindings for every export, uninitialised), **evaluate** (run bodies, dependencies first). Because imports are live bindings, a cycle resolves cleanly *as long as you do not read a binding before its module has evaluated*. Evaluation order here is `b` first, then `a`, then `main`. Reading `a` at the top level of `b.js` would throw `ReferenceError: Cannot access 'a' before initialization` (the temporal dead zone). Reading it inside a function called later is fine.

### How to avoid them

- **Extract shared code** into a third module that both import (the usual best fix).
- **Defer access**: read the import inside functions, not at module top level.
- **Dependency injection**: pass the collaborator in instead of importing it.
- **Lint for cycles** with tools such as `madge` or `eslint-plugin-import` (`import/no-cycle`).

## More Ideas from the Book

- **Module cache**: a module body runs once; every importer gets the same instance ([db.js](db.js), [ex5.js](ex5.js)). Singletons come free, but two copies of a package under different `node_modules` paths are two singletons.
- **Default vs named exports**: named exports are greppable, refactor-friendly and tree-shakeable; a default export suits a module that is "one thing" (a class or factory). Avoid mixing without a reason.
- **Monkey patching** ([ex6.js](ex6.js)): because modules are shared objects, one module can modify another's exports. Powerful for mocking and instrumentation, dangerous in production because it is global and order-dependent.
- **Wrapping modules**: CJS wraps each file in a function receiving `exports, require, module, __filename, __dirname`. That wrapper is why top-level variables are private. In ESM use `import.meta.url` / `import.meta.filename` / `import.meta.dirname` instead.
- **Interop**: ESM can `import` CJS (`module.exports` becomes the default export). CJS cannot `require()` ESM in older Node versions (it can in recent ones, unless the graph uses top-level `await`); use `await import()`.
- **Module specifiers for packages**: the `exports` field in `package.json` controls what a package exposes, giving real encapsulation of internals.

## TypeScript Notes ([ts/](ts))

TypeScript sits on top of the same module system, and the design lessons carry over directly.

- **`import type` / `export type`** are erased at compile time, so they cannot cause runtime cycles. When two modules only need each other's *types*, use `import type`. Enable `verbatimModuleSyntax` so the compiler enforces it.
- **Program to interfaces** ([types.ts](ts/types.ts), [service.ts](ts/service.ts)): `createService(logger: Logger)` depends on an interface, not on `ConsoleLogger`. This is dependency injection, and it removes the usual cause of cycles (concrete modules importing each other).
- **Keep `types.ts` free of imports** from implementation files. Types at the bottom of the graph means cycles are structurally hard to create.
- **`tsconfig` for Node ESM**: `"module": "nodenext"`, `"moduleResolution": "nodenext"`, and `"type": "module"` in `package.json`. Under `nodenext`, relative imports need explicit extensions, matching Node's real behaviour.
- **Run `.ts` directly**: recent Node versions strip types (no `tsc` needed for scripts), but only for erasable syntax. Enums, namespaces and constructor parameter properties (`constructor(private x)`) are rejected, which is why [consoleLogger.ts](ts/consoleLogger.ts) assigns `this.level` explicitly. Setting `erasableSyntaxOnly` in `tsconfig` flags this early.
- **Dynamic imports stay typed**: `const m = await import(path)` is typed when the path is a literal; with a computed path (as in [main.js](main.js)) the result is `any`, so validate the input and narrow the type yourself.

## Takeaways

1. A module = a file with its own scope; `export` is the only door out.
2. Prefer a small, intentional public API (revealing module idea).
3. Use ESM for new code; know CJS for existing packages and interop.
4. Use `node:` for core modules and include file extensions for relative imports.
5. Use dynamic `import()` for runtime or conditional loading, and validate the input.
6. Module caching makes singletons easy and shared mutable state easy to get wrong.
