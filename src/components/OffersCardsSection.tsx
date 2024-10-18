import { Offers } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import { moneyFormatter, timeFromNow } from "@/lib/utils";

type Props = {
  offers: Offers[];
};

type OfferCardProps = {
  offer: Offers;
};

export function OfferCard(props: OfferCardProps) {

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all ease-in-out duration-300 p-4 lg:p-8 flex flex-col justify-center items-center gap-y-2">
      <Link href={`/oferta/${props.offer.id}`}>
        <div className="relative w-48 h-48">
          <Image src={props.offer.thumbnail} alt={props.offer.title} fill />
        </div>
      </Link>
      <Link href={`/oferta/${props.offer.id}`}>
        <h2 className="font-[family-name:var(--font-geist-sans)]">
          {props.offer.title}
        </h2>
      </Link>
      <div className="w-full flex flex-col gap-y-4">
        <div className="w-full flex flex-col items-center py-6">
          <p className="text-xs">
            A partir de:
          </p>
          <p className="font-[family-name:var(--font-geist-mono)] font-semibold">
            {moneyFormatter.format(Number(props.offer.price))}
          </p>
        </div>
        <a href={props.offer.affiliateLink} target="_blank">
          <Button className="w-full bg-green-600 hover:bg-green-800 font-[family-name:var(--font-geist-sans)]">
            Pegar promoção
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </div>
      <div className="w-full flex justify-end text-xs font-[family-name:var(--font-geist-sans)]">
        <p className="text-gray-400">
          Há {timeFromNow(props.offer.createdAt)}
        </p>
      </div>
    </div>
  );
}

export function OffersCardsSection(props: Props) {
  return (
    <section className="py-16 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-4">
          {
            props.offers.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))
          }
        </div>
      </div>
    </section>
  );
}