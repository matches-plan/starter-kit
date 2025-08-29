'use server'

import { clearSession } from "@/lib/auth";

export async function signoutAction(redirectTo?: string) {

  await clearSession(redirectTo);
}