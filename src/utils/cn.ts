import clsx, { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export const resumePdfUrl = `${import.meta.env.BASE_URL}resume/Niraj_Jadhav_Resume.pdf`;
