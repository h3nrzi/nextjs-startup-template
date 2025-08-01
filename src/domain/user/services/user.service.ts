import { LoginInput, RegisterInput } from "@/features/auth/schema/auth.schema";
import { NotAuthorizedError } from "@/shared/errors/not-authorized-error";
import { BadRequestError } from "@/shared/errors/bad-request-error";
import { IUserDoc } from "../entities/user.interface";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
	constructor(private readonly userRepo: UserRepository) {}

	async register(registerInput: RegisterInput): Promise<IUserDoc> {
		const existingUser = await this.userRepo.findByEmail(registerInput.email);
		if (existingUser) {
			throw new BadRequestError("ایمیل قبلا استفاده شده است");
		}

		return (await this.userRepo.create(registerInput)).toObject();
	}

	async login(loginInput: LoginInput): Promise<IUserDoc> {
		const authenticatedUser = await this.userRepo.findByEmail(loginInput.email);
		if (!authenticatedUser) {
			throw new NotAuthorizedError("ایمیل یا رمز عبور اشتباه است");
		}

		const isPasswordValid = await authenticatedUser.comparePassword(loginInput.password);
		if (!isPasswordValid) {
			throw new NotAuthorizedError("ایمیل یا رمز عبور اشتباه است");
		}

		return authenticatedUser.toObject();
	}
}
