import ClubesCarousel from "./HomeComponents/ClubesCarousel";
import Novedades from "./HomeComponents/Novedades";
import Sponsors from "./HomeComponents/Sponsors";
import Hero from "./HomeComponents/Hero";

function Home() {
    return (
        <>
        <main className="bg-gray-300">
            <Hero />
            <ClubesCarousel />
            <Novedades />
            <Sponsors />
        </main>
        </>
    );
}

export default Home;
