import { Router } from "express";
import prisma from "../config/db";
import { Request, Response } from "express";

const router = Router();

// Login user (cek berdasarkan email + nik)
router.post("/login", async (req: Request, res: Response) => {
  const { email, nik } = req.body;
  try {
    const user = await prisma.dummyUser.findFirst({
      where: { email, nik },
    });

    if (!user) {
      return res.status(404).json({ message: "Akun tidak ditemukan!" });
    }

    res.json({ message: "Login berhasil", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Register user baru
router.post("/register", async (req: Request, res: Response) => {
  const { nik, nama, email, jabatan } = req.body;
  try {
    const existing = await prisma.dummyUser.findFirst({
      where: { OR: [{ email }, { nik }] },
    });
    if (existing) {
      return res.status(400).json({ message: "Email atau NIK sudah terdaftar" });
    }

    const newUser = await prisma.dummyUser.create({
      data: { nik, nama, email, jabatan },
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal register user" });
  }
});

export default router;
