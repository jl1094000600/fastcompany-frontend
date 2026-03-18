/**
 * Dependency resolver – scans generated code for import statements
 * and returns a map of npm packages that Sandpack should install.
 *
 * This ensures the sandbox does not fail when the AI forgets to
 * include a package in package.json.
 */

import type { FileMap } from "@/types";

/** Well-known packages that don't need auto-resolution */
const BUILT_IN = new Set([
  "react",
  "react-dom",
  "react/jsx-runtime",
  "next",
  "next/link",
  "next/image",
  "next/router",
  "next/navigation",
]);

/**
 * Extract third-party npm package names from all code files.
 *
 * @returns Record mapping package name → "latest"
 */
export function resolveExtraDependencies(
  files: FileMap
): Record<string, string> {
  const deps: Record<string, string> = {};

  // Match: import ... from 'pkg'  or  import ... from "pkg"
  // Also handles: import 'pkg' (side-effect imports)
  const importRegex = /import\s+.*?from\s+['"]([^./][^'"]*)['"]/g;
  const sideEffectRegex = /import\s+['"]([^./][^'"]*)['"]/g;

  for (const [filePath, code] of Object.entries(files)) {
    // Skip package.json itself
    if (filePath.endsWith("package.json")) continue;

    for (const regex of [importRegex, sideEffectRegex]) {
      regex.lastIndex = 0; // reset
      let match: RegExpExecArray | null;
      while ((match = regex.exec(code)) !== null) {
        const raw = match[1];
        // Extract the package name (handle scoped packages like @foo/bar)
        const pkgName = raw.startsWith("@")
          ? raw.split("/").slice(0, 2).join("/")
          : raw.split("/")[0];

        if (!BUILT_IN.has(pkgName) && !BUILT_IN.has(raw)) {
          deps[pkgName] = "latest";
        }
      }
    }
  }

  return deps;
}

/**
 * Merge auto-detected deps with any explicit deps from a generated package.json.
 */
export function mergeWithPackageJson(
  files: FileMap,
  extraDeps: Record<string, string>
): Record<string, string> {
  let existing: Record<string, string> = {};

  // Try to parse an existing package.json
  const pkgContent = files["package.json"] ?? files["/package.json"];
  if (pkgContent) {
    try {
      const pkg = JSON.parse(pkgContent);
      existing = pkg.dependencies ?? {};
    } catch {
      // ignore parse errors
    }
  }

  return { ...extraDeps, ...existing };
}
