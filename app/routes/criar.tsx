import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Button } from "~/components/button";
import { Logo } from "~/components/logo";

import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect } from "~/utils";
import {
  validateEmailField,
  validateFirstNameField,
  validatePasswordField,
} from "~/utils/input-validation";
import { badRequest } from "~/utils/request.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (
    typeof firstName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "O formulário não foi enviado corretamente",
    });
  }

  const fields = { firstName, email, password };
  const fieldErrors = {
    firstName: validateFirstNameField(firstName),
    email: validateEmailField(email),
    password: validatePasswordField(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields, formError: null });
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return badRequest({
      fieldErrors: null,
      fields,
      formError: "Já existe um usuário com esse e-mail.",
    });
  }

  const user = await createUser({ firstName, email, password });
  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: V2_MetaFunction = () => [
  { title: "Criar conta | Matheus Atrasou Hoje?" },
];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.fieldErrors?.firstName) {
      firstNameRef.current?.focus();
    } else if (actionData?.fieldErrors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.fieldErrors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Link to="/" prefetch="intent">
          <Logo />
        </Link>

        <Form method="post" className="space-y-6 mt-8">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-300"
            >
              Nome
            </label>
            <div className="mt-1">
              <input
                ref={firstNameRef}
                id="firstName"
                required
                autoFocus={true}
                defaultValue={actionData?.fields?.firstName}
                name="firstName"
                type="text"
                autoComplete="firstName"
                aria-invalid={
                  actionData?.fieldErrors?.firstName ? true : undefined
                }
                aria-describedby="first-name-error"
                placeholder="Seu primeiro nome"
                className="w-full rounded bg-zinc-900 border border-gray-800 px-2 py-1 text-lg aria-[invalid]:border-red-600 ring-amber-400/50 ring-offset-zinc-950  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {actionData?.fieldErrors?.firstName ? (
                <div
                  className="pt-1 text-red-600 mt-1 text-sm"
                  id="first-name-error"
                >
                  {actionData.fieldErrors.firstName}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                defaultValue={actionData?.fields?.email}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.fieldErrors?.email ? true : undefined}
                aria-describedby="email-error"
                placeholder="email@example.com"
                className="w-full rounded bg-zinc-900 border border-gray-800 px-2 py-1 text-lg aria-[invalid]:border-red-600 ring-amber-400/50 ring-offset-zinc-950  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {actionData?.fieldErrors?.email ? (
                <div
                  className="pt-1 text-red-600 mt-1 text-sm"
                  id="email-error"
                >
                  {actionData.fieldErrors.email}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Senha
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                required
                defaultValue={actionData?.fields?.password}
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={
                  actionData?.fieldErrors?.password ? true : undefined
                }
                aria-describedby="password-error"
                className="w-full rounded bg-zinc-900 border border-gray-800 px-2 py-1 text-lg aria-[invalid]:border-red-600 ring-amber-400/50 ring-offset-zinc-950  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              {actionData?.fieldErrors?.password ? (
                <div
                  className="pt-1 text-red-600 mt-1 text-sm"
                  id="password-error"
                >
                  {actionData.fieldErrors.password}
                </div>
              ) : null}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div>
            <Button type="submit" className="w-full">
              Criar conta
            </Button>
            {actionData?.formError ? (
              <div
                className="pt-1 text-red-600 mt-1 text-sm text-center"
                id="password-error"
              >
                {actionData.formError}
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Já possui uma conta?{" "}
              <Link
                className="text-amber-400 underline"
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Logar
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
