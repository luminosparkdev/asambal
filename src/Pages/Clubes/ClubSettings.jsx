import ClubHeroSettings from "./ClubHeroSettings";
import { useAuth } from "../../Auth/AuthContext";

function ClubSettings() {
  const { activeClubId } = useAuth();
  const clubId = activeClubId;
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Configuración del club
      </h1>

      {/* Apariencia */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">
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
