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
import { useParams, useRouter, useSearchParams } from "next/navigation";

const loginFormSchema = z
  .object({
    password: z
      .string()
      .min(2, {
        message: "enter your password.",
      })
      .min(6, {
        message: "password must be at least 6 characters.",
      }),
    confirmPassword: z
      .string()
      .min(2, {
        message: "confirm your password.",
      })
      .min(6, {
        message: "password must be at least 6 characters.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // This shows the error on confirmPassword field
  });

const LoginFormSchema = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const token = searchParams.get("token") as string;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setLoading(true);
    try {
      const response = await axios.patch(
        `/api/auth/reset-password/${id}?token=${token}`,
        {
          password: values.password,
          confirmPassword: values.confirmPassword,
          id,
          token,
        }
      );

      if (response.status === 200) {
        toast.success("Password reset successfully");
        router.push("/login");
      }
    } catch (error) {
      console.log("Error resetting password:", error);
      toast.error("An error occurred during the password reset");
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-8 px-4  ">
      <div className="bg-white py-8 px-6 md:px-10 rounded-[32px] shadow-lg max-w-xl w-full">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Enter New Password
        </h2>

        <p className="text-center text-xs 2xl:text-sm text-[#28303FCC] mb-6">
          {" "}
          Please enter your new password and confirm it.
        </p>

        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onSubmit)}
            className="space-y-2 md:space-y-4 mt-5"
          >
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-4 text-xs md:text-sm 2xl:text-base">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="enter password"
                      {...field}
                      className="bg-[#F7F7F7] text-xs md:text-sm 2xl:text-base rounded-full border border-[#28303F1A] py-5 2xl:py-7 px-4 w-full text-[#28303FCC]"
                    />
                  </FormControl>
                  <FormMessage className="pl-4" />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pl-4 text-xs md:text-sm 2xl:text-base">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="confirm password"
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
                "Reset Password"
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
