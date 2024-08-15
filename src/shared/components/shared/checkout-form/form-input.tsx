import React from 'react';
import { ClearButton } from '@/shared/components/shared/clear-button';
import { ErrorText } from '@/shared/components/shared/error-text';
import { Input, InputIMask } from '@/shared/components/ui';
import { useFormContext } from 'react-hook-form';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	isMask?: boolean;
	maskTemplate?: string;
	label?: string;
	required?: boolean;
	className?: string;
}

export const FormInput: React.FC<Props> = ({
	name,
	isMask = false,
	maskTemplate,
	label,
	required,
	className,
	...props
}) => {
	const {
		register,
		formState: { errors },
		watch,
		setValue,
	} = useFormContext();

	const value = watch(name);
	const errorText = errors[name]?.message as string;

	const onClickClear = () => {
		setValue(name, '', { shouldValidate: true });
	};

	return (
		<div className={className}>
			{label && (
				<p className="font-medium mb-2">
					{label} {required && <span className="text-red-500">*</span>}
				</p>
			)}

			<div className="relative">
				{isMask && (
					<InputIMask
						className="h-12 text-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						maskTemplate={maskTemplate}
						{...register(name)}
						{...props}
					/>
				)}
				{!isMask && (
					<Input
						className="h-12 text-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
						{...register(name)}
						{...props}
					/>
				)}

				{value && <ClearButton onClick={onClickClear} />}
			</div>

			{errorText && (
				<ErrorText
					text={errorText}
					className="mt-2 ml-2"
				/>
			)}
		</div>
	);
};
