export const slugify = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** Copy only whitelisted keys — prevents mass-assignment from request bodies. */
export const pick = (source = {}, keys = []) =>
  keys.reduce((out, key) => {
    if (source[key] !== undefined) out[key] = source[key];
    return out;
  }, {});
