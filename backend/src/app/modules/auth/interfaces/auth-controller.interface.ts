// ou onde estiver

import { AuthenticateBodySchema } from "../controller/authenticate-account.controller";

export interface IAuthenticateController {
  handle(body: AuthenticateBodySchema): Promise<{ access_token: string }>;
}
