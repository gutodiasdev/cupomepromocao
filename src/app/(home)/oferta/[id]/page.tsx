import { OfferCard } from "@/components/OffersCardsSection";
import { singleOffer } from "@/lib/db/queries";
import Link from "next/link";

export default async function Page(props: { params: { id: string; }; }) {
  const offer = await singleOffer(Number(props.params.id));

  if (!offer) {
    return (
      <div className="min-h-[100dvh] grid place-content-center text-center">
        <h1 className="font-[family-name:var(--font-geist-sans)] font-semibold">
          Desculpe, mas esta oferta não existe.
        </h1>
        <Link href="/" className="mt-4 py-2 px-4 bg-brand text-white rounded-md">
          Voltar para o início
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] max-w-screen grid place-content-center">
      <OfferCard offer={offer} />
      <div className="w-full flex justify-end text-xs font-[family-name:var(--font-geist-sans)]">
        <p className="text-gray-400 text-center p-4">
          O preço e disponibilidade do produto podem variar, pois as ofertas são por tempo limitado.
        </p>
      </div>
      <Link href="/" className="mt-32 max-w-48 py-2 px-4 text-gray-600 rounded-md text-center mx-auto ">
        Voltar para o início
      </Link>
    </div>
  );
}