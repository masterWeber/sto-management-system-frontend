import { Suspense } from "react";
import { Center, Loader } from "@mantine/core";
import { LoginForm } from "@/features/auth/ui/login-form";

export default function LoginPage() {
  return (
    <Center mih="100vh" p="md">
      <Suspense fallback={<Loader />}>
        <LoginForm />
      </Suspense>
    </Center>
  );
}
