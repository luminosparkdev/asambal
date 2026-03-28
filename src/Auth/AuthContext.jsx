import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeClubId, setActiveClubId] = useState(null);
  const [activeRole, setActiveRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedClub = localStorage.getItem("activeClubId");
    const storedRole = localStorage.getItem("activeRole");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
  if (storedClub) {
    setActiveClubId(storedClub);
  }
  if (storedRole) {
    setActiveRole(storedRole);
  }
  setLoading(false);
  }, []);

  const login = (userData) => {
  console.log("LOGIN CONTEXT RECIBE", userData);

  setUser(userData);

  const firstClubId = userData.clubs?.[0]?.clubId || null;
  setActiveClubId(firstClubId);

  localStorage.setItem("user", JSON.stringify(userData));
  if (firstClubId) localStorage.setItem("activeClubId", firstClubId);

  localStorage.removeItem("activeRole"); // 👈 evita basura vieja
  };


  const selectRole = (role) => {
  setActiveRole(role);
  localStorage.setItem("activeRole", role);
};

  const logout = () => {
    setUser(null);
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("activeClubId");
  localStorage.removeItem("activeRole")
  };

  const switchClub = (clubId) => {
    if (!user.clubs.some(c => c.clubId === clubId))return;
    setActiveClubId(clubId);
    localStorage.setItem("activeClubId", clubId);
  };

  return (
    <AuthContext.Provider value={{
      user,
      activeRole,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      selectRole,
      activeClubId,
      switchClub,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
