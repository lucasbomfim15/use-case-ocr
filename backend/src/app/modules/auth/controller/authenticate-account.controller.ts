import { Body, Controller, Post } from "@nestjs/common";

import { z } from "zod";
import AuthService from "../service/auth-service";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/auth")
export default class AuthenticateController{
  constructor(private readonly authService: AuthService) {}

  @Post("/signin")
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    return this.authService.authenticate(email, password);
  }
}