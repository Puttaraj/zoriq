export { PasswordWorkspace } from "./components/password-workspace";
export const seoContent = `
## Why You Need a Strong Password Generator
A password generator helps protect your online identity by generating secure, unpredictable passwords that cannot be easily guessed or cracked by automated hacking tools. Using a single, weak password across multiple accounts makes your data vulnerable. A random password creator solves this by creating distinct, highly secure credentials for every site you use.

## Best Practices for Password Security
* **Never Reuse Passwords:** Make sure every online profile, banking app, and digital account has its own unique password.
* **Make It Long:** Length is the single most important factor. Aim for at least 12 to 16 characters.
* **Combine Character Types:** A strong password should mix uppercase and lowercase letters, numbers, and special symbols (like \`!\`, \`@\`, or \`$\`).
* **Avoid Personal Details:** Never include common words, dictionary entries, birthdates, names, or keyboard patterns like "qwerty".
* **Use a Password Manager:** Store your generated passwords securely in a trusted password manager instead of writing them down or keeping them in plain text files.
`;

export const faqs = [
  {
    question: "How does the password generator work?",
    answer:
      "This tool runs entirely in your browser using the cryptographically secure Web Crypto API (crypto.getRandomValues). It generates random strings based on your selected criteria (length, uppercase, lowercase, numbers, symbols) without sending any data over the internet.",
  },
  {
    question: "Is this password generator safe to use?",
    answer:
      "Yes, it is 100% safe. Since all calculations occur locally on your machine (client-side), no server receives or logs the generated passwords. Your passwords are never stored, ensuring complete privacy.",
  },
  {
    question: "What makes a password strong?",
    answer:
      "A strong password contains a mixture of character types and is sufficiently long. Passwords with 16 characters or more containing symbols, numbers, and mixed-case letters take trillions of years to crack using brute-force techniques.",
  },
  {
    question: "Should I include symbols in my passwords?",
    answer:
      "Absolutely. Symbols significantly increase the entropy (randomness) of a password, making it much harder for dictionary attacks and automated hackers to crack.",
  },
  {
    question: "Can I generate passwords in bulk?",
    answer:
      "Yes, you can use the 'Generate Multiple Passwords' slider to create up to 20 passwords at once, making it quick and easy to set up new accounts.",
  },
];
