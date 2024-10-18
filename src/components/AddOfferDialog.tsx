import { Dispatch, SetStateAction, useReducer } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { z } from "zod";
import { moneyFormatter } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addOffer } from "@/lib/db/queries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const addOfferSchema = z.object({
  title: z.string({ message: "Você precisa inserir o título da oferta" }).max(100, "O título só pode ter máximo 100 caracteres"),
  thumbnail: z.string({ message: "Você precisa inserir a thumbnail da oferta" }),
  price: z.number({ message: "Você precisa inserir o preço da oferta" }),
  oldPrice: z.number().optional(),
  affiliateLink: z.string({ message: "Você precisa inserir o link de afiliado da oferta" }),
  offeredBy: z.string({ message: "Você precisa escolher quem está oferecendo a oferta" }),
  expiresAt: z.string({ message: "Você precisa informar quando a oferta expira" })
});

export function AddOfferDialog(props: Props) {
  const form = useForm<z.infer<typeof addOfferSchema>>({
    resolver: zodResolver(addOfferSchema),
  });

  const mutation = useMutation({
    mutationKey: ["add_offer"],
    mutationFn: async () => {
      const input = form.getValues();
      await addOffer(input);
    },
    onSuccess: () => {
      toast.success("Oferta adicionada com sucesso");
      props.setOpen(false);
    },
    onError: (error) => toast.error(error.message)
  });

  const [price, setPrice] = useReducer((_: any, next: string) => {
    const digits = next.replace(/\D/g, "");
    return moneyFormatter.format(Number(digits) / 100);
  }, "");
  const [oldPrice, setOldPrice] = useReducer((_: any, next: string) => {
    const digits = next.replace(/\D/g, "");
    return moneyFormatter.format(Number(digits) / 100);
  }, "");

  function handleChange(realChangeFn: Function, formattedValue: string) {
    const digits = formattedValue.replace(/\D/g, "");
    const realValue = Number(digits) / 100;
    realChangeFn(realValue);
  }

  const handleSubmit = async () => {
    await mutation.mutateAsync();
  };

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Cadastrar Oferta
          </DialogTitle>
        </DialogHeader>
        <Form  {...form}>
          <form className="grid gap-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Título da Oferta</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Link da Imagem da Oferta</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Preço Atual do Produto</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        onChange={(ev) => {
                          setPrice(ev.target.value);
                          handleChange(field.onChange, ev.target.value);
                        }}
                        value={price}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="oldPrice"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Preço Anterior do Produto (opicional)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        onChange={(ev) => {
                          setOldPrice(ev.target.value);
                          handleChange(field.onChange, ev.target.value);
                        }}
                        value={oldPrice}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="affiliateLink"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Link de Afiliado</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="offeredBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ofertado por</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a loja da oferta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mercado_livre">Mercado Livre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Expira em</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
        <Button className="bg-brand" onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? (
            <div className="flex items-center gap-x-2">
              <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none" className="animate-spin fill-white">
                <g fill="#000000" fill-rule="evenodd" clip-rule="evenodd">
                  <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" opacity=".2" />
                  <path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z" />
                </g>
              </svg>
              Salvando...
            </div>
          ) : "Cadastrar Oferta"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}