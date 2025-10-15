import { Request, Response } from "express";
import prisma from "../config/db";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, nik } = req.body;

    const user = await prisma.dummyUser.findFirst({
      where: { email, nik },
    });

    if (!user) {
      return res.status(401).json({ message: "Akun tidak ditemukan" });
    }

    // kalau berhasil
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
