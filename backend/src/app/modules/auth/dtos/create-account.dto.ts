import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAccountDTO {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;
  
}