import ClubesCarousel from "./HomeComponents/ClubesCarousel";
import Novedades from "./HomeComponents/Novedades";
import Sponsors from "./HomeComponents/Sponsors";

function Home() {
    return (
        <>
        <main className="bg-gray-300">
            <ClubesCarousel />
            <Novedades />
            <Sponsors />
        </main>
        </>
    );
}

export default Home;
