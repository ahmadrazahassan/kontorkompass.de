import type { Access, CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";
import { revalidatePath } from "next/cache";

export const isLoggedIn: Access = ({ req }) => Boolean(req.user);

// Public read; with drafts enabled, visitors only see published documents.
export const publicReadPublished: Access = ({ req }) => (req.user ? true : { _status: { equals: "published" } });

const bust = () => {
  try {
    revalidatePath("/", "layout");
  } catch {
    // Not running inside a Next request (e.g. seed script): nothing to revalidate.
  }
};

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  bust();
  return doc;
};
export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  bust();
  return doc;
};

export const hooks = { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] };

export const baseAccess = { read: () => true, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn };
