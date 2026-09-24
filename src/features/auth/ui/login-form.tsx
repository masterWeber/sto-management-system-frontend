"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { getErrorMessage } from "@/shared/api/api-error";
import { login } from "../api";

const schema = z.object({
  login: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: { login: "", password: "" },
    validate: zod4Resolver(schema),
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/") ? next : "/");
      router.refresh();
    },
    onError: (error) => {
      notifications.show({
        color: "red",
        title: "Ошибка входа",
        message: getErrorMessage(error),
      });
    },
  });

  return (
    <Paper withBorder shadow="md" p="xl" radius="md" w={380} maw="100%">
      <form onSubmit={form.onSubmit((values) => mutation.mutate(values))}>
        <Stack>
          <Stack gap={4}>
            <Title order={3} ta="center">
              СТО — вход
            </Title>
            <Text c="dimmed" size="sm" ta="center">
              Система управления станцией техобслуживания
            </Text>
          </Stack>
          <TextInput
            label="Логин"
            placeholder="admin"
            autoComplete="username"
            {...form.getInputProps("login")}
          />
          <PasswordInput
            label="Пароль"
            placeholder="••••••••"
            autoComplete="current-password"
            {...form.getInputProps("password")}
          />
          <Button type="submit" loading={mutation.isPending} fullWidth>
            Войти
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
