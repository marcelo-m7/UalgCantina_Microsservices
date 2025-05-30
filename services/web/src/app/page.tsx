// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/menu');
  // Return null or an empty fragment if redirect doesn't immediately stop execution,
  // though Next.js redirect typically handles this.
  return null;
}
