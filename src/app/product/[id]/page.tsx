import React from 'react';

export default function ProductPage({
	params: { id },
}: {
	params: { id: string };
}) {
	return <p>Product {id}</p>;
}
