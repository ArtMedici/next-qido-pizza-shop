"use client";

import { CartButton, Categories, Container } from "@/shared/components/shared";
import { cn } from "@/shared/lib/utils";
import { Category } from "@prisma/client";
import React from "react";
import { useHeaderStore } from "@/shared/store";
import Link from "next/link";
import Image from "next/image";

interface Props {
  categories: Category[];
  className?: string;
}

export const TopBar: React.FC<Props> = ({ categories, className }) => {
  const headerIsHidden = useHeaderStore((state) => state.isHidden);

  return (
    <div
      className={cn(
        "sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10",
        className,
      )}
    >
      <Container className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {headerIsHidden && (
            <Link href="/">
              <div className="flex items-center gap-4">
                <Image src="/logo.png" width={35} height={35} alt="Logo" />
                <h1 className="text-2xl uppercase font-black">QIDO Пицца</h1>
              </div>
            </Link>
          )}
          <Categories items={categories} />
        </div>
        {headerIsHidden && <CartButton />}
      </Container>
    </div>
  );
};
