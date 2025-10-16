import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/db";

const router = Router();

// ===== REGISTER =====
router.post("/register", async (req: Request, res: Response) => {
  const { nik, nama, email, password, jabatan } = req.body;

  try {
    // Cek apakah email sudah terdaftar di dummy_account
    const existingAccount = await prisma.dummyAccount.findUnique({
      where: { email },
    });

    if (existingAccount) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // Buat atau cari dummy_user berdasarkan NIK
    let user = await prisma.dummyUser.findUnique({ where: { nik } });

    if (!user) {
      user = await prisma.dummyUser.create({
        data: { nik, nama, email, jabatan },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat dummy_account dan hubungkan ke dummy_user
    await prisma.dummyAccount.create({
      data: {
        email,
        password: hashedPassword,
        user_id: user.id,
      },
    });

    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal register user" });
  }
});

// ===== LOGIN =====
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Cari akun login beserta data user terkait
    const account = await prisma.dummyAccount.findUnique({
      where: { email },
      include: { dummy_user: true }, // pakai relasi sesuai schema
    });

    if (!account) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: account.user_id, email: account.email },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: account.dummy_user.id,
        nik: account.dummy_user.nik,
        nama: account.dummy_user.nama,
        email: account.dummy_user.email,
        jabatan: account.dummy_user.jabatan,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
