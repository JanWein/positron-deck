/** JSON string literals also safely quote ordinary filesystem paths in R and Python. */
export function rString(value: string): string { return JSON.stringify(value); }
export function requireRPackage(name: string, expression: string): string {
  if (!/^[a-zA-Z][a-zA-Z0-9.]*$/.test(name)) throw new Error('Invalid package identifier');
  return `if (!requireNamespace(${rString(name)}, quietly=TRUE)) stop(${rString(`Package '${name}' is missing. Install it manually in this R environment and retry.`)}, call.=FALSE); ${expression}`;
}
