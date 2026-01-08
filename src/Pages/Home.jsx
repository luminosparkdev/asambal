import logo from "../Assets/Asambal/logo.png"
import hero from "../Assets/hero.png"

function Home() {
    return (
        <>
<section
  className="flex flex-col items-center justify-center h-screen bg-center bg-cover"
  style={{ backgroundImage: `url(${hero})` }}
>
  <div className="p-10 text-center rounded bg-black/50">
    <h1 className="text-5xl font-bold text-white">
      Bienvenido a AsAmBal
    </h1>
  </div>
</section>

        <section>
            <h2>Clubes</h2>
            <div>
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
            </div>
        </section>
        <section>
            <h2>Novedades</h2>
            <div>
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
            </div>
        </section>
        <section>
            <h2>Sponsors</h2>
            <div>
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
                <img src={logo} alt="logo" />
            </div>
        </section>
        </>
    )
}

export default Home