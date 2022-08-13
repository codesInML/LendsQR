declare global {
  namespace Express {
    interface User extends Buyer {}
  }
}
