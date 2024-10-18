"use client";

import { AddOfferDialog } from "@/components/AddOfferDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [open, setOpen] = useState<boolean>(false);

  const openDialog = () => {
    setOpen(true);
  }

  return (
    <main>
      <section className="flex-1 p-4 lg:p-8">
        <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
          Painel de Controle
        </h1>
        <div>
          <Button className="bg-brand flex items-center gap-x-2" onClick={openDialog}>
            <Plus className="h-4 w-4"/>
            Adicionar oferta
          </Button>
        </div>
      </section>
      <AddOfferDialog open={open} setOpen={setOpen}/>
    </main>
  );
}