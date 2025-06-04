import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          formButtonPrimary: 
            "bg-blue-500 hover:bg-blue-600 text-sm normal-case",
          card: "bg-transparent shadow-none",
          headerTitle: "text-white",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton: 
            "bg-white hover:bg-gray-100 border border-gray-300 text-gray-900",
          socialButtonsBlockButtonText: "text-gray-900",
          dividerText: "text-gray-400",
          formFieldLabel: "text-gray-300",
          formFieldInput: 
            "bg-gray-700 border-gray-600 text-white focus:border-blue-500",
          footerActionText: "text-gray-400",
          footerActionLink: "text-blue-500 hover:text-blue-400",
        },
      }}
    />
  );
}