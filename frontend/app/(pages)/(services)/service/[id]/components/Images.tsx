"use client";

import { IService } from "@/app/types/service";
import Seller from "./Seller";
import { IUser } from "@/app/types/user";

interface ImagesProps {
  selectedImage: string;
  service: IService | null;
  setSelectedImage: (image: string) => void;
  user?: IUser;
}

export default function Images({
  selectedImage,
  service,
  setSelectedImage,
  user,
}: ImagesProps) {
  return (
    <section>
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/3">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={service?.title}
            className="h-125 w-full object-cover"
          />
        ) : (
          <div className="flex h-125 items-center justify-center text-white/30">
            No image available
          </div>
        )}
      </div>

      {service!.images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {service?.images.map((image) => (
            <button
              key={image.publicId}
              type="button"
              onClick={() => setSelectedImage(image.url)}
              className={`overflow-hidden rounded-xl border-2 transition ${
                selectedImage === image.url
                  ? "border-brand-green"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={image.url}
                alt={service.title}
                className="h-20 w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Seller */}
      <Seller user={user} />
    </section>
  );
}
