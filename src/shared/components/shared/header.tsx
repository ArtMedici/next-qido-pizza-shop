'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/shared/lib/utils';
import { CartButton, Container, SearchInput } from '@/shared/components/shared';
import { Button } from '@/shared/components/ui';
import { User } from 'lucide-react';
import { useOrderStatus } from '@/hooks';

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
	const { orderStatus } = useOrderStatus();
	
	return (
			<header className={cn('border-b border-gray-100', className)}>
				<Container className="flex items-center justify-between py-8">
					<Link href="/">
						<div className="flex items-center gap-4">
							<Image
									src="/logo.png"
									width={35}
									height={35}
									alt="Logo"
							/>
							<div>
								<h1 className="text-2xl uppercase font-black">QIDO</h1>
								<p className="text-sm text-gray-400 leading-3">
									вкусней уже некуда
								</p>
							</div>
						</div>
					</Link>
					
					{hasSearch && (
							<div className="mx-10 flex-1">
								<SearchInput/>
							</div>
					)}
					
					<div className="flex items-center gap-3">
						<Button
								variant="outline"
								className="flex items-center gap-1">
							<User size={16}/>
							Войти
						</Button>
						
						{hasCart && <CartButton/>}
					</div>
				</Container>
			</header>
	);
};
