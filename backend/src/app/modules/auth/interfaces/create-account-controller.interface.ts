import { User } from "@prisma/client";
import { CreateAccountDTO } from "../dtos/create-account.dto";

export interface ICreateAccountController {
  handle(createAccountDto: CreateAccountDTO): Promise<User>;
}
