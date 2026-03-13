import { useCalendar } from "@/components/calendar/contexts/calendar-context";

import type { ITransaction } from "@/components/calendar/interfaces";

export function useUpdateTransaction() {
  const { setLocalTransactions } = useCalendar();


  const updateTransaction = (transaction: ITransaction) => {
    const newTransaction: ITransaction = transaction;

    newTransaction.startDate = new Date(transaction.startDate).toISOString();
    newTransaction.endDate = new Date(transaction.endDate).toISOString();

    setLocalTransactions(prev => {
      const index = prev.findIndex(t => t.id === transaction.id);
      if (index === -1) return prev;
      return [...prev.slice(0, index), newTransaction, ...prev.slice(index + 1)];
    });
  };

  return { updateTransaction };
}
