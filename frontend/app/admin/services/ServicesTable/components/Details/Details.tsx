"use client";

import { useCallback, useEffect, useState } from "react";
import { IService, ServiceStatus } from "@/app/types/service";
import { statusConfig } from "@/app/admin/users/VerificationDetails/utils/statusConfig";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Description from "./components/Description";
import Features from "./components/Features";
import Keywords from "./components/Keywords";
import RejectionReason from "./components/RejectionReason";
import Seller from "./components/Seller";
import Info from "./components/Info";
import Dates from "./components/Dates";
import Modal from "./components/Modal";

interface DetailsProps {
  service: IService;
}

export default function Details({ service }: DetailsProps) {
  const images = service.images ?? [];
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const user = service.freelancer?.user;
  const status =
    statusConfig[service.status] ?? statusConfig[ServiceStatus.PENDING];

  const next = useCallback(
    () => setCurrent((i) => (images.length ? (i + 1) % images.length : 0)),
    [images.length],
  );

  const prev = useCallback(
    () =>
      setCurrent((i) =>
        images.length ? (i - 1 + images.length) % images.length : 0,
      ),
    [images.length],
  );

  useEffect(() => {
    if (!modalOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen, next, prev]);

  return (
    <div className="space-y-6">
      <Header service={service} className={status.className} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Sidebar
            service={service}
            images={images}
            current={current}
            setCurrent={setCurrent}
            prev={prev}
            next={next}
            setModalOpen={setModalOpen}
          />

          <Description service={service} />

          <Features service={service} />

          <Keywords service={service} />

          <RejectionReason service={service} />
        </div>

        <aside className="space-y-6">
          <Seller service={service} user={user} />
          <Info service={service} images={images} />

          <Dates service={service} />
        </aside>
      </div>

      <Modal
        modalOpen={modalOpen}
        images={images}
        current={current}
        service={service}
        setModalOpen={setModalOpen}
        prev={prev}
        next={next}
      />
    </div>
  );
}
