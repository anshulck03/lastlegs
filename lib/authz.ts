// @deprecated Use lib/auth/requireUser instead
// This file is kept for backwards compatibility but forwards to the new helper
import { requireUser as newRequireUser } from "./auth/requireUser";

export const requireUser = newRequireUser;