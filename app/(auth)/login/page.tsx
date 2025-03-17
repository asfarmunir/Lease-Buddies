"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginFormSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "enter your email.",
    })
    .email("email must be a valid email address."),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
});

const signupFormSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "enter your email.",
    })
    .email("email must be a valid email address."),
  password: z.string().min(6, {
    message: "enter password.",
  }),
  confirmPassword: z.string().min(6, {
    message: "enter password again.",
  }),
  firstName: z.string().min(2, {
    message: "please enter your first name.",
  }),
  lastName: z.string().min(2, {
    message: "please enter your last name.",
  }),
});

const LoginFormSchema = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [type, setType] = useState("login");

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  function onSignupSubmit(values: z.infer<typeof signupFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-8 px-4  ">
      <div className="bg-white py-8 px-6 md:px-10 rounded-[32px] shadow-lg max-w-xl w-full">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-xs 2xl:text-sm text-[#28303FCC] mb-6">
          Welcome back, Please enter your details.
        </p>

        <div className="flex space-x-2 mb-6 bg-[#F7F7F7] rounded-full">
          <button
            onClick={() => setType("login")}
            className={`"flex-1 py-3 transition-all 2xl:py-4 w-full font-medium ${
              type === "login" ? "bg-[#28303F] text-white" : "text-[#28303FCC]"
            }   rounded-full text-xs md:text-sm 2xl:text-base"`}
          >
            Sign in
          </button>
          <button
            onClick={() => setType("signup")}
            className={`"flex-1 py-3 transition-all 2xl:py-4 w-full font-medium ${
              type === "signup" ? "bg-[#28303F] text-white" : "text-[#28303FCC]"
            }   rounded-full text-xs md:text-sm 2xl:text-base"`}
          >
            Sign up
          </button>
        </div>

        {type === "login" && (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onSubmit)}
              className="space-y-2 md:space-y-4"
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
                        placeholder="shadcn"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pl-4 text-xs md:text-sm 2xl:text-base">
                      Password
                    </FormLabel>
                    <div className="bg-[#F7F7F7] relative rounded-full border border-[#28303F1A] py-1 2xl:py-3 px-4 w-full text-[#28303FCC]">
                      <FormControl className="">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="border-none text-xs md:text-sm 2xl:text-base shadow-none focus:outline-none focus:ring-0 focus:ring-transparent focus:border-transparent"
                        />
                      </FormControl>

                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <FormMessage className="pl-4" />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between pb-2 2xl:pb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-gray-700 text-xs 2xl:text-sm"
                  >
                    Remember password
                  </label>
                </div>
                <a
                  href="#"
                  className="font-semibold text-[#28303F] text-xs 2xl:text-sm"
                >
                  Forgot password?
                </a>
              </div>
              <Button
                type="submit"
                className=" w-full  rounded-full bg-gradient-to-b from-[#3A99D3] to-[#3A89D3] py-3 "
              >
                Submit
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
        )}
        {type === "signup" && (
          <Form {...signupForm}>
            <form
              onSubmit={signupForm.handleSubmit(onSignupSubmit)}
              className="space-y-2 md:space-y-4"
            >
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pl-4 text-xs md:text-sm 2xl:text-base">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        {...field}
                        className="bg-[#F7F7F7] text-xs md:text-sm 2xl:text-base rounded-full border border-[#28303F1A] py-5 2xl:py-7 px-4 w-full text-[#28303FCC]"
                      />
                    </FormControl>
                    <FormMessage className="pl-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pl-4 text-xs md:text-sm 2xl:text-base">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter first name"
                        {...field}
                        className="bg-[#F7F7F7] text-xs md:text-sm 2xl:text-base rounded-full border border-[#28303F1A] py-5 2xl:py-7 px-4 w-full text-[#28303FCC]"
                      />
                    </FormControl>
                    <FormMessage className="pl-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pl-4 text-xs md:text-sm 2xl:text-base">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter last name"
                        {...field}
                        className="bg-[#F7F7F7] text-xs md:text-sm 2xl:text-base rounded-full border border-[#28303F1A] py-5 2xl:py-7 px-4 w-full text-[#28303FCC]"
                      />
                    </FormControl>
                    <FormMessage className="pl-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pl-4 text-xs md:text-sm 2xl:text-base">
                      Password
                    </FormLabel>
                    <div className="bg-[#F7F7F7] relative rounded-full border border-[#28303F1A] py-1 2xl:py-3 px-4 w-full text-[#28303FCC]">
                      <FormControl className="">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="border-none text-xs md:text-sm 2xl:text-base shadow-none focus:outline-none focus:ring-0 focus:ring-transparent focus:border-transparent"
                        />
                      </FormControl>

                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <FormMessage className="pl-4" />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="pl-4 text-xs md:text-sm 2xl:text-base">
                      Confirm Password
                    </FormLabel>
                    <div className="bg-[#F7F7F7]  relative rounded-full border border-[#28303F1A] py-1 2xl:py-3 px-4 w-full text-[#28303FCC]">
                      <FormControl className="">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="border-none text-xs md:text-sm 2xl:text-base shadow-none focus:outline-none focus:ring-0 focus:ring-transparent focus:border-transparent"
                        />
                      </FormControl>

                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <FormMessage className="pl-4" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className=" w-full  rounded-full bg-gradient-to-b from-[#3A99D3] to-[#3A89D3] py-3 2xl:py-3.5 "
              >
                Next
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
        )}
      </div>
    </div>
  );
};

export default LoginFormSchema;
