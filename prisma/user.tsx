import prisma from "./prismaDb";

export interface User {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  goal?: string;
}

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({});
  return users;
};

export const getUser = async (email: string | string[] | any) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};

export const createUser = async (email: string, name: string) => {
  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  });
  return user;
};

export const updateUser = async (id: string, updateData: User) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: { ...updateData },
  });
  return user;
};
