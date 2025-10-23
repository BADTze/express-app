import { Request, Response } from "express";
import prisma from "../config/db";
import { userSchema } from "../utils/validator";
import { ZodError } from "zod";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.dummyUser.findMany({
      include: {
        dummy_account: {
          select: { email: true, created_at: true },
        },
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.dummyUser.findUnique({
      where: { id },
      include: { dummy_account: true },
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.parse(req.body);
    const newUser = await prisma.dummyUser.create({ data: parsed });
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Validasi gagal", errors: error.issues });
    }
    console.error("Create User Error:", error);
    res.status(500).json({ message: "Gagal menambahkan user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.dummyUser.delete({ where: { id } });
    res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(400).json({ message: "Gagal menghapus user" });
  }
};
