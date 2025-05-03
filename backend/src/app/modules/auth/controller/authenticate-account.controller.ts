import { Body, Controller, Post } from "@nestjs/common";

import { z } from "zod";
import AuthService from "../service/auth-service";
import { IAuthenticateController } from "../interfaces/auth-controller.interface";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/auth")
export default class AuthenticateController implements IAuthenticateController{
  constructor(private readonly authService: AuthService) {}

  @Post("/signin")
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    return this.authService.authenticate(email, password);
  }
}