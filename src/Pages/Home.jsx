import ClubesCarousel from "./HomeComponents/ClubesCarousel";
import Novedades from "./HomeComponents/Novedades";
import Sponsors from "./HomeComponents/Sponsors";
import Hero from "./HomeComponents/Hero";
import Fixture from "./HomeComponents/Fixture";

function Home() {
    return (
        <>
        <main className="bg-gray-300">
            <Hero />
            <ClubesCarousel />
            <Fixture />
            <Novedades />
            <Sponsors />
        </main>
        </>
    );
}

export default Home;
