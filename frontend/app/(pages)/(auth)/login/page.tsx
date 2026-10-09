"use client";
import { authApi, LoginData } from "@/app/apis/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import LeftForm from "./components/LeftForm";
import RightImage from "../register/components/RightImage";

export default function LoginPage() {
  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
     await authApi.login(form);

      toast.success(`Welcome back`);
      router.push("/");
      setForm({
        email: "",
        password: "",
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
          loading={loading}
        />

        <RightImage />
      </div>
    </main>
  );
}
