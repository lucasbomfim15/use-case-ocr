import { User } from "@prisma/client";
import { CreateAccountDTO } from "../dtos/create-account.dto";

export interface IAuthService {
  createAccount(createAccountDto: CreateAccountDTO): Promise<User>;
  authenticate(email: string, password: string): Promise<{ access_token: string }>;
}
