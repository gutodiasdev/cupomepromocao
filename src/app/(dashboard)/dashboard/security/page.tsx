'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { updatePasswordOnPage } from '@/app/(login)/actions';
import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "A senha precisa ter no mínimo 8 caracteres").max(100),
    newPassword: z.string().min(8, "A senha precisa ter no mínimo 8 caracteres").max(100),
    confirmPassword: z.string().min(8, "A senha precisa ter no mínimo 8 caracteres").max(100),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function SecurityPage() {
  const [updatePasswordFormData, setUpdatePasswordFormData] = useState<z.infer<typeof updatePasswordSchema>>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const updatePasswordMutation = useMutation({
    mutationKey: ["update_password_mutation"],
    mutationFn: async () => {
      const isInputValidated = updatePasswordSchema.safeParse(updatePasswordFormData);
      if (!isInputValidated.success) throw new Error(isInputValidated.error.errors[0].message);
      await updatePasswordOnPage(updatePasswordFormData);
    },
    onSuccess: () => toast.success("Senha atualizada com sucesso", { position: "bottom-right" })
  });

  const deleteAccountMutation = useMutation({
    mutationKey: ["delete_account_mutation"],
    mutationFn: async () => {

    }
  });

  const handlePasswordSubmit = async () => {
    await updatePasswordMutation.mutateAsync();
  };

  const handleDeleteSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    await deleteAccountMutation.mutateAsync();
    console.log(event.currentTarget);
  };

  const handleUpdatePasswordInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setUpdatePasswordFormData({ ...updatePasswordFormData, [event.target.name]: event.target.value });
  };


  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium bold text-gray-900 mb-6">
        Security Settings
      </h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Senha Atual</Label>
              <Input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                maxLength={100}
                onChange={e => handleUpdatePasswordInputChange(e)}
              />
            </div>
            <div>
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={100}
                onChange={e => handleUpdatePasswordInputChange(e)}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                maxLength={100}
                onChange={e => handleUpdatePasswordInputChange(e)}
              />
            </div>
            {updatePasswordMutation.isError && (
              <p className="text-red-500 text-sm">{updatePasswordMutation.error.message}</p>
            )}
            <Button
              type="submit"
              className="bg-brand hover:bg-brand text-white"
              disabled={updatePasswordMutation.isPending}
              onClick={handlePasswordSubmit}
            >
              {updatePasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Atualizar Senha
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Account deletion is non-reversable. Please proceed with caution.
          </p>
          <form onSubmit={handleDeleteSubmit} className="space-y-4">
            <div>
              <Label htmlFor="delete-password">Confirm Password</Label>
              <Input
                id="delete-password"
                name="password"
                type="password"
                required
                minLength={8}
                maxLength={100}
              />
            </div>
            {deleteAccountMutation.isError && (
              <p className="text-red-500 text-sm">{deleteAccountMutation.error.message}</p>
            )}
            <Button
              type="submit"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteAccountMutation.isPending}
            >
              {deleteAccountMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card> */}
    </section>
  );
}
