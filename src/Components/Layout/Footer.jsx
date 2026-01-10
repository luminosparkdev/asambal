import logo from '../../Assets/Asambal/logo.png';

function Footer() {
  return (
    <footer className="text-blue-200 bg-blue-900 ">
      <div className="flex flex-col items-center justify-between gap-4 px-4 py-6 mx-auto max-w-7xl md:flex-row">

        {/* Copyright */}
        <div className='flex items-center gap-x-2'>
          <img
            src={logo}
            alt="Logo de ASAMBAL"
            className="w-10 p-1 bg-white rounded-full"
          />
          <p className="text-sm">
            © {new Date().getFullYear()} ASAMBAL. Todos los derechos reservados.
          </p>
        </div>

        {/* Créditos */}
        <p className="text-sm">
          Desarrollado por{" "}
          <a
            className="font-semibold text-blue-300 transition-colors hover:text-blue-200"
            href="https://luminospark-dev.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lumino Spark
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
