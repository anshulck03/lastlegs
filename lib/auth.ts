export async function requireUser() {
  // Dev-only: return a stable dev user id
  if (process.env.NO_AUTH_DEV_MODE === 'true') {
    return { id: 'dev_user_1' }
  }
  throw new Error('Auth not implemented')
}

