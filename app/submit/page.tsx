import { SubmitForm } from "@/components/SubmitForm";

export const metadata = {
  title: "Share Your Visa Case — VisaPulse",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="text-center text-3xl font-bold tracking-tight text-white">
        Share Your Visa Case
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm text-zinc-400">
        Anonymous submission. Your experience helps others plan with real
        numbers.
      </p>
      <div className="mt-8">
        <SubmitForm />
      </div>
    </div>
  );
}
