import { Request, Response } from "express";
import prisma from "../config/db";
import { userSchema } from "../validator/validator";
import { ZodError } from "zod";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.dummyUser.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.dummyUser.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.parse(req.body);

    const newUser = await prisma.dummyUser.create({
      data: parsed,
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: "Validation error", errors: error.issues });
    }
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.dummyUser.delete({ where: { id } });
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to delete user" });
  }
};
