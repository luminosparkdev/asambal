import ClubHeroSettings from "./ClubHeroSettings";
import { useAuth } from "../../Auth/AuthContext";

function ClubSettings() {
  const { activeClubId } = useAuth();
  const clubId = activeClubId;
  return (
    <div className="bg-[url('/src/assets/Asambal/fondodashboard.webp')] bg-cover bg-center">
      <h1 className="m-4 text-2xl font-bold text-gray-200">
        Configuración del club
      </h1>

      {/* Apariencia */}
      <section className="mb-10">
        <h2 className="m-4 text-gray-200 text-lg font-semibold">
          Apariencia del micrositio
        </h2>

        <ClubHeroSettings />
      </section>

      {/* Futuro */}
      {/* <ClubLogoUploader /> */}
      {/* <ClubColors /> */}
    </div>
  );
}

export default ClubSettings;
