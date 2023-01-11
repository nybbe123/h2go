import prisma from "./prismaDb";

export interface History {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  goal?: string;
  intake?: string;
  today?: string;
  day?: string;
  month?: string;
}

export const getHistory = async (id: string) => {
  const history = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return history;
};

export const getAllHistories = async (id: string) => {
  const history = await prisma.history.findUnique({
    where: {
      id,
    }
  });
  return history;
};

export const createHistory = async (email: string, goal: string, intake: string, today: string, day: string, month: string) => {
  const history = await prisma.history.create({
    data: {
      goal,
      intake,
      today,
      day,
      month,
      user: {
        connect: {
          email: email
        }
    },
    }
  });
  return history;
};