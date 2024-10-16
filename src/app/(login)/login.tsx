"use client";

import { ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CircleIcon, Loader2, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { signInOnPage } from './actions';

export const signInSchema = z.object({
  email: z.string().email("Você deve inserir um email válido").min(3).max(255),
  password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres" }).max(100),
});

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup'; }) {
  const [formData, setFormData] = useState<z.infer<typeof signInSchema>>({ email: "", password: "" });
  const router = useRouter();
  const { isPending, error, isError, mutateAsync, reset } = useMutation({
    mutationFn: async () => {
      const result = signInSchema.safeParse(formData);
      if (!result.success) {
        throw new Error(result.error.errors[0].message);
      }
      await signInOnPage(result.data);
    },
    mutationKey: ["sign_in_form"],
    onSuccess: () => {
      router.push("/dashboard");
    }
  });
  
  const handleForm = async () => {
    await mutateAsync();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-brand" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'signin'
            ? 'Faça o login em sua conta'
            : 'Create your account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="space-y-6">
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={50}
                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                required
                minLength={8}
                maxLength={100}
                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                onChange={(e) => handleInputChange(e)}
              />
            </div>
          </div>

          {isError && (
            <div className="text-red-400 border border-red-500 bg-red-50 text-sm py-2 px-4 rounded-full flex justify-between items-center">
              <p className="text-red-500">
                {error.message}
              </p>
              <X className="h-4 w-4 cursor-pointer" onClick={reset} />
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
              disabled={isPending}
              onClick={handleForm}
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Loading...
                </>
              ) : mode === 'signin' ? (
                'Entrar'
              ) : (
                'Sign up'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
