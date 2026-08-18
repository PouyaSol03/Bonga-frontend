export type CreditPayment = {
  amount: string;
  id: string;
  method: string;
  paidAt: string;
  service: string;
  status: string;
  statusTone: "error" | "success";
};
