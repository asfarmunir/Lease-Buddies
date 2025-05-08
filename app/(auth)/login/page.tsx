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
import Link from "next/link";

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

const signupFormSchema = z
  .object({
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
    firstname: z.string().min(2, {
      message: "please enter your first name.",
    }),
    lastname: z.string().min(2, {
      message: "please enter your last name.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // This shows the error on confirmPassword field
  });

const LoginFormSchema = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [type, setType] = useState("login");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState({
    terms: false,
    privacy: false,
    cookies: false,
  });

  const router = useRouter();
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
      email: "asfarma2815@gmail.com",
      password: "asfarasfar",
      confirmPassword: "asfarasfar",
      firstname: "asfar",
      lastname: "munir",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setLoading(true);
    const { email, password } = values;
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!res!.ok) {
      toast.error(res!.error);
      setLoading(false);
      return;
    }
    toast.success("Logged in successfully!");
    setLoading(false);
    router.push("/home");
  }

  async function onSignupSubmit(values: z.infer<typeof signupFormSchema>) {
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/signup", values);
      if (response.status !== 200) {
        throw new Error("Something went wrong");
      }
      if (response.data.status !== 200) {
        toast.error(response.data.message);
        return;
      }
      toast.success("Account created successfully");
      router.push("/welcome");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-8 px-4  ">
      <div className="bg-white py-8 px-6 md:px-10 rounded-[32px] shadow-lg max-w-xl w-full">
        {type === "login" ? (
          <h2 className="text-2xl font-semibold text-center mb-2">
            Sign in to your account
          </h2>
        ) : step === 1 ? (
          <h2 className="text-2xl font-semibold text-center mb-2">
            Create an account
          </h2>
        ) : (
          <h2 className="text-2xl font-semibold text-center mb-2">
            Finish account
          </h2>
        )}

        {type === "login" ? (
          <p className="text-center text-xs 2xl:text-sm text-[#28303FCC] mb-6">
            {" "}
            Enter your email and password to sign in to your account.
          </p>
        ) : step === 1 ? (
          <p className="text-center text-xs 2xl:text-sm text-[#28303FCC] mb-6">
            {" "}
            Enter your email and password to sign in to your account.
          </p>
        ) : (
          <p className="text-center text-xs 2xl:text-sm text-[#28303FCC] mb-6">
            {" "}
            Confirm your consent and finalize your account.
          </p>
        )}
        <div
          className={`
          ${type === "signup" && step === 2 ? "hidden" : "flex"}
           space-x-2 mb-6 bg-[#F7F7F7] rounded-full`}
        >
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
                        placeholder="enter email"
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
                <Link
                  href="/forget-password"
                  className="font-semibold text-[#28303F] text-xs 2xl:text-sm"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className=" w-full disabled:opacity-50  rounded-full bg-gradient-to-b from-[#3A99D3] to-[#3A89D3] py-3 "
              >
                {loading ? (
                  <RiLoader3Line className="animate-spin " />
                ) : (
                  "Sign in"
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
        )}
        {type === "signup" && (
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)}>
              {step === 1 ? (
                <div className="space-y-2 md:space-y-4">
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
                    name="firstname"
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
                    name="lastname"
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
                    type="button"
                    onClick={async () => {
                      const isValid = await signupForm.trigger([
                        "email",
                        "firstname",
                        "lastname",
                        "password",
                        "confirmPassword",
                      ]);
                      if (isValid) {
                        setStep(2);
                      }
                    }}
                    className=" w-full  rounded-full bg-gradient-to-b from-[#3A99D3] to-[#3A89D3] py-3 2xl:py-3.5 "
                  >
                    Next
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-4">
                  <div className=" w-full p-3 2xl:p-5 3xl:p-6 bg-[#F7F7F7] rounded-[10px] border-[#FFFFFF1A] flex items-center justify-between gap-5">
                    <p className="text-xs 2xl:text-sm 3xl:text-base ">
                      I agree to the processing of personal data according to
                      Privacy Policy
                    </p>
                    <Checkbox
                      onCheckedChange={(checked) => {
                        //@ts-ignore
                        setTerms((prev) => ({ ...prev, privacy: checked }));
                      }}
                    />
                  </div>
                  <div className=" w-full p-3 2xl:p-5 3xl:p-6 bg-[#F7F7F7] rounded-[10px] border-[#FFFFFF1A] flex items-center justify-between gap-5">
                    <p className="text-xs 2xl:text-sm 3xl:text-base ">
                      Do you want to receive news about our project Sign up to
                      our Newsletter?
                    </p>
                    <Checkbox
                      onCheckedChange={(checked) => {
                        //@ts-ignore
                        setTerms((prev) => ({ ...prev, terms: checked }));
                      }}
                    />
                  </div>
                  <div className=" w-full p-3 2xl:p-5 3xl:p-6 bg-[#F7F7F7] rounded-[10px] border-[#FFFFFF1A] flex items-center justify-between gap-5">
                    <p className="text-xs 2xl:text-sm 3xl:text-base ">
                      According my name is correct and correspond to the
                      government issued identification
                    </p>
                    <Checkbox
                      onCheckedChange={(checked) => {
                        //@ts-ignore
                        setTerms((prev) => ({ ...prev, cookies: checked }));
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={
                      !terms.privacy ||
                      // !terms.terms ||
                      !terms.cookies ||
                      loading
                    }
                    className=" w-full disabled:opacity-70  rounded-full bg-gradient-to-b from-[#3A99D3] to-[#3A89D3] py-3 2xl:py-3.5 "
                  >
                    {loading ? (
                      <RiLoader3Line className="animate-spin " />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              )}

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
