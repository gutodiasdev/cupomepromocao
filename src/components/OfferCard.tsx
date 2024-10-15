import Image from "next/image";

type Props = {
  data: {
    id: number;
    title: string;
    thumbnail: string;
    price: number;
    oldPrice?: number;
  };
};

export function OfferCard({ data }: Props) {
  return (
    <div className="p-6 bg-white rounded-md flex flex-col justify-center">
      <div className="relative">
        <Image src={data.thumbnail} alt={data.title} fill />
      </div>
    </div>
  );
}