import { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";
import { User } from "src/user/user.entity";

export const GetUserDecorator = createParamDecorator((_, context: ExecutionContext): User => {
    const req = context.switchToHttp().getRequest();
    return req.user;
})