"use client";
import { authApi, RegisterData } from "@/app/apis/auth";
import { UserRole } from "@/app/types/user";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import RightImage from "./components/RightImage";
import LeftForm from "./components/LeftForm";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: UserRole.FREELANCER,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authApi.register(form);

      toast.success(`Welcome to Orvexa`);
      router.push("/");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: UserRole.FREELANCER,
      });
    } catch (error: any) {
      if (error?.message) {
        setErrorMessage(
          Array.isArray(error.message) ? error.message[0] : error.message,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!errorMessage) return;

    const timeout = setTimeout(() => setErrorMessage(""), 4000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  return (
    <main className="min-h-screen bg-brand-navy text-white">
      <div className="flex min-h-screen">
        <LeftForm
          errorMessage={errorMessage}
          handleSubmit={handleSubmit}
          form={form}
          handleChange={handleChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          setForm={setForm}
          loading={loading}
        />

        <RightImage />
      </div>
    </main>
  );
}
