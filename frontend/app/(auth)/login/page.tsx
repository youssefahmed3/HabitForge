import LoginForm from "@/components/loginForm/LoginForm";
import React from "react";

function page() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Login to your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to Login
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

export default page;