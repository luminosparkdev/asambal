function Footer() {
  return (
    <footer className="text-white bg-blue-900 ">
      <div className="flex flex-col items-center justify-between gap-4 px-4 py-6 mx-auto max-w-7xl md:flex-row">

        {/* Copyright */}
        <p className="text-sm text-blue-200">
          © {new Date().getFullYear()} ASAMBAL. Todos los derechos reservados.
        </p>

        {/* Créditos */}
        <p className="text-sm">
          Desarrollado por{" "}
          <span className="font-semibold text-blue-300 transition-colors hover:text-blue-200">
            Lumino Spark
          </span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
