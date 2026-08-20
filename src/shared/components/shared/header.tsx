"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  AuthModal,
  CartButton,
  Container,
  ProfileButton,
  SearchInput,
} from "@/shared/components/shared";
import { Button } from "@/components/ui";
import { useSearchParams } from "next/navigation";
import { notifyOrderStatus, notifyVerifiedProfile } from "@/shared/lib";
import { useHeaderStore } from "@/shared/store";
import { useIntersection } from "react-use";

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({
  hasSearch = true,
  hasCart = true,
  className,
}) => {
  const setIsHiddenHeader = useHeaderStore((state) => state.setIsHidden);
  const intersectionRef = React.useRef(null);
  const intersection = useIntersection(intersectionRef, {
    threshold: 0,
  });

  const searchParams = useSearchParams();
  const [openAuthModal, setOpenAuthModal] = React.useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  React.useEffect(() => {
    if (!intersection?.isIntersecting) {
      setIsHiddenHeader(true);
    } else {
      setIsHiddenHeader(false);
    }
  }, [intersection?.isIntersecting, setIsHiddenHeader]);

  React.useEffect(() => {
    if (searchParams.has("paid")) {
      notifyOrderStatus();
    }

    if (searchParams.has("verified")) {
      notifyVerifiedProfile();
    }
  }, [searchParams]);

  return (
    <header
      ref={intersectionRef}
      className={cn("border-b border-gray-100", className)}
    >
      <Container className="flex items-center justify-between py-8">
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" width={35} height={35} alt="Logo" />
            <div>
              <h1 className="text-2xl uppercase font-black">QIDO Пицца</h1>
              <p className="text-sm text-gray-400 leading-3">
                тестовая пиццерия
              </p>
            </div>
          </div>
        </Link>

        {hasSearch && (
          <div className="mx-10 flex-1">
            <SearchInput />
          </div>
        )}

        <div className="flex items-center gap-3">
          <AuthModal
            open={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
          />

          {isAdmin && (
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-1.5">
                <LayoutDashboard size={16} />
                Админка
              </Button>
            </Link>
          )}

          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
