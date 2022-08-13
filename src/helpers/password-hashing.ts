import bcrypt from "bcrypt";
export class Password {
  static async toHash(password: string) {
    const saltWorkFactor: number = parseInt(
      <string>process.env.SALT_WORK_FACTOR
    );
    const salt = await bcrypt.genSalt(saltWorkFactor);
    return await bcrypt.hash(password, salt);
  }
  static async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
