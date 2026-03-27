import { baseApi } from "@/lib/api/axios/api";
import { Transaction, Package } from "@/lib/api/types";

export const getTransactionsByInstituteId = async (): Promise<Transaction[]> => {
  const response = await baseApi.get("/transactions/get-transactions-by-institute-id");
  return response.data.data;
};

export const getAllPackages = async (): Promise<Package[]> => {
  const response = await baseApi.get("/packages/get-all-packages");
  return response.data.data;
};

export const createTransaction = async (packageId: string, amount: number): Promise<any> => {
  const response = await baseApi.post(`/transactions/create-transaction/${packageId}`, { amount });
  return response.data;
};
