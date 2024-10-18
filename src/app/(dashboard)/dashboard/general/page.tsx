'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/lib/auth';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { ChangeEvent, useState } from 'react';
import { updateAccountOnPage } from '@/app/(login)/actions';
import toast from 'react-hot-toast';
import { updateAccountSchema } from '@/lib/utils';

export default function GeneralPage() {
  const { user } = useUser();
  if (!user) {
    return null;
  }
  const [formData, setFormData] = useState<z.infer<typeof updateAccountSchema>>({ name: user.name, email: user.email });
  const { isError, error, isSuccess, isPending, mutateAsync } = useMutation({
    mutationKey: ["update_user_account"],
    mutationFn: async () => {
      const isValidated = updateAccountSchema.safeParse(formData)
      if (!isValidated.success) throw new Error(isValidated.error.errors[0].message);
      await updateAccountOnPage(formData);
    },
    onSuccess: () => toast.success("Atualizado com sucesso", { position: "bottom-right" })
  })

  const handleSubmit = async () => {
    await mutateAsync();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        General Settings
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações da conta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                defaultValue={user.name}
                onChange={e => handleInputChange(e)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                defaultValue={user.email}
                onChange={e => handleInputChange(e)}
                required
              />
            </div>
            {isError && (
              <p className="text-red-500 text-sm">{error.message}</p>
            )}
            <Button
              type="submit"
              className="bg-brand hover:bg-brand text-white"
              disabled={isPending}
              onClick={handleSubmit}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Mudanças'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
