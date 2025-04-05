"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import axios from "axios";
import { RiLoader3Line } from "react-icons/ri";
import { useRouter } from "next/navigation";

const loginFormSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "enter your email.",
    })
    .email("email must be a valid email address."),
});

const LoginFormSchema = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/reset-password",
        {
          email: values.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Reset link has been sent to your email!", {
          icon: "📧",
        });
      }
    } catch (error) {
      toast.error("Error: User not found or issue sending email.");
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-8 px-4  ">
      <div className="bg-white py-8 px-6 md:px-10 rounded-[32px] shadow-lg max-w-xl w-full">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Reset Password
        </h2>

        <p className="text-center text-xs 2xl:text-sm text-[#28303FCC] mb-6">
          {" "}
          Please enter your email address to receive a password reset link.
        </p>

        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onSubmit)}
            className="space-y-2 md:space-y-4 mt-5"
          >
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-4 text-xs md:text-sm 2xl:text-base">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter email"
                      {...field}
                      className="bg-[#F7F7F7] text-xs md:text-sm 2xl:text-base rounded-full border border-[#28303F1A] py-5 2xl:py-7 px-4 w-full text-[#28303FCC]"
                    />
                  </FormControl>
                  <FormMessage className="pl-4" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className=" w-full disabled:opacity-50  rounded-full bg-gradient-to-b from-[#3A99D3] to-[#3A89D3] py-4 "
            >
              {loading ? (
                <RiLoader3Line className="animate-spin " />
              ) : (
                "Send Reset Link"
              )}
            </Button>
            <p className="mt-4 text-xs text-center text-gray-500">
              This site is protected by reCAPTCHA and the Google{" "}
              <a href="#" className="text-[#28303F]">
                privacy policy
              </a>{" "}
              <br className=" hidden sm:block" />
              and{" "}
              <a href="#" className="text-[#28303F]">
                terms of service
              </a>{" "}
              apply.
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginFormSchema;
