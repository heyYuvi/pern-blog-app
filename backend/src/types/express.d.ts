import { User } from "../../generated/prisma/client.ts";

type SafeUser = Omit<User, "password">;

declare global{
    namespace Express{
        interface Request{
            user: SafeUser
        }
    }
}

export {};