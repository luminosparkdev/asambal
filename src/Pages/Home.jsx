import logo from "../Assets/Asambal/logo.png"
import hero from "../Assets/hero.png"

function Home() {
    return (
        <>
        <section className="flex flex-col items-center justify-center h-screen">
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <img src={hero} alt="hero" style={{width: "1500px", width: "1200px", margin: "0px", padding: "0px"}} />
                <h1 style={{fontSize: "50px", color: "black"}}>Bienvenido a AsAmBal</h1>
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