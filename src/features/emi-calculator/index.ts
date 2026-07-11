export { EmiWorkspace } from "./components/emi-workspace";
export const seoContent = `
## What is an EMI Calculator?
An Equated Monthly Installment (EMI) calculator is a tool designed to help you determine your fixed monthly payments for any type of credit loan (home loan, car loan, educational loan, or personal loan). By evaluating the primary loan variables — principal amount, annual interest rate, and repayment tenure — it calculates your financial commitment before you borrow.

## Understanding the Breakdown
* **Monthly EMI:** The fixed payment you owe to the bank every month. This consists of both principal repayment and interest components.
* **Principal Amount:** The original sum of money borrowed from the lender.
* **Interest Payable:** The total charge you pay the bank for borrowing the principal. It is calculated over the tenure using the reducing balance rate.
* **Amortization Schedule:** A chronological table showing how each monthly payment is split between principal reduction and interest, along with the remaining balance.

## EMI Mathematical Formula
Monthly EMIs are calculated using the reducing balance method formula:
$$EMI = \\frac{P \\times r \\times (1+r)^N}{(1+r)^N - 1}$$
Where:
* **P** = Principal loan amount
* **r** = Monthly interest rate (annual rate divided by 12 and then divided by 100)
* **N** = Repayment tenure in months
`;

export const faqs = [
  {
    question: "What is a reducing balance interest rate?",
    answer:
      "In a reducing balance loan, interest is calculated on the remaining outstanding principal balance at the end of each month, rather than the original loan amount. As you pay off your principal, the interest component decreases over time.",
  },
  {
    question: "How can I reduce my overall interest payment?",
    answer:
      "You can reduce interest by making prepayments (paying off chunks of principal early), choosing a shorter loan tenure, or negotiating a lower interest rate with your bank.",
  },
  {
    question: "How does loan tenure affect my monthly EMI?",
    answer:
      "Choosing a longer tenure reduces your monthly EMI amount, making it easier to manage on a monthly budget. However, it significantly increases the total interest paid over the life of the loan. A shorter tenure is always cheaper in the long run.",
  },
  {
    question: "Can this calculator be used for home, car, and personal loans?",
    answer:
      "Yes, the EMI math is identical. Simply input your specific loan variables (amount, rate, tenure) to calculate monthly repayments for any loan type.",
  },
  {
    question: "What is the amortization schedule?",
    answer:
      "The amortization schedule is a monthly breakdown table showing how much of each payment goes toward paying off the interest charges versus reducing the actual principal loan balance.",
  },
];
