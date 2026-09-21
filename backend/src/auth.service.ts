import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from './prisma.service';

type RegisterInput = { name: string; email: string; password: string; phone?: string };

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async register(input: RegisterInput) {
    const email = input.email.trim().toLowerCase();
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException('Ya existe una cuenta con ese correo.');
    const user = await this.prisma.user.create({
      data: { name: input.name.trim(), email, passwordHash: await bcrypt.hash(input.password, 12), phone: input.phone?.trim() || null },
    });
    return this.sessionFor(user);
  }

  async login(emailInput: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: emailInput.trim().toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new UnauthorizedException('Correo o contrasena incorrectos.');
    return this.sessionFor(user);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true } });
    if (!user) throw new UnauthorizedException('La cuenta no existe.');
    return user;
  }

  async updateProfile(userId: string, input: { name: string; phone: string; currentPassword: string; newPassword?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(input.currentPassword, user.passwordHash))) throw new UnauthorizedException('La contraseña actual no coincide.');
    const updated = await this.prisma.user.update({ where: { id: userId }, data: { name: input.name.trim(), phone: input.phone.trim(), ...(input.newPassword ? { passwordHash: await bcrypt.hash(input.newPassword, 12) } : {}) } });
    return this.sessionFor(updated);
  }

  private async sessionFor(user: { id: string; name: string; email: string; phone: string | null; role: 'CLIENT' | 'ADMIN' }) {
    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role });
    return { accessToken, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } };
  }
}
