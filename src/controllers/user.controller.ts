import { Request, Response } from "express";
import prisma from "../config/db";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.dummy_user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.dummy_user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { nik, nama, email, jabatan } = req.body;
    const newUser = await prisma.dummy_user.create({
      data: { nik, nama, email, jabatan },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to create user", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.dummy_user.delete({ where: { id } });
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to delete user" });
  }
};
