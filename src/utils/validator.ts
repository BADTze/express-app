import { z } from "zod";

export const userSchema = z.object({
  nik: z.string().length(4, "NIK harus 4 karakter angka"),
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  jabatan: z.string().optional(),
});


export const userUpdateSchema = userSchema.partial();

export type UserSchema = z.infer<typeof userSchema>;
