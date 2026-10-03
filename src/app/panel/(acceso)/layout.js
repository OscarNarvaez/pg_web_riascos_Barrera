import Logo from '@/components/Logo';

/** Ingreso y restablecimiento de contraseña: sin sesión, sin menú. */
export default function LayoutAcceso({ children }) {
  return (
    <main
      id="contenido"
      className="flex min-h-dvh items-center justify-center px-(--margen-lateral) pt-[calc(3rem+env(safe-area-inset-top))] pb-12"
    >
      <div className="flex w-full max-w-md flex-col gap-10">
        <Logo className="h-10 w-auto self-start" prioritario />
        {children}
      </div>
    </main>
  );
}
