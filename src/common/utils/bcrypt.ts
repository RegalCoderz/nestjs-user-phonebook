import * as bcrypt from 'bcrypt';

export async function passwordHashing(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export async function comparePassword(enteredPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, hashedPassword);
}