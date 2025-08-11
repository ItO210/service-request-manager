import { apiFetch } from "@/utils/apiFetch";
import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { ROLES } from "@/constants/roles";

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { role } = jwtDecode(token);
        const roleHomeRoutes = {
          [ROLES.ADMIN]: "/dashboard",
          [ROLES.TECH]: "/gestion/solicitudes",
          [ROLES.USER]: "/solicitud/equipo",
        };
        navigate(roleHomeRoutes[role] || "/", { replace: true });
      } catch (error) {
        localStorage.removeItem("token");
      }
    }
  }, []);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const registrationNumberRef = useRef(null);
  const passwordRef = useRef(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!registrationNumber || !password) {
      if (!registrationNumber && !password) {
        setError("Por favor, ingrese su clave de usuario y contraseña");
        registrationNumberRef.current?.focus();
      } else if (!registrationNumber) {
        setError("Por favor, ingrese su clave de usuario");
        registrationNumberRef.current?.focus();
      } else if (!password) {
        setError("Por favor, ingrese su contraseña");
        passwordRef.current?.focus();
      }
      return;
    }

    // Validar credenciales con el back
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ registrationNumber, password }),
      });

      const token = data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("registrationNumber", registrationNumber);
      const decoded = jwtDecode(token);
      const role = decoded.role;

      switch (role) {
        case ROLES.ADMIN:
          navigate("/dashboard");
          break;
        case ROLES.TECH:
          navigate("/gestion/solicitudes");
          break;
        case ROLES.USER:
          navigate("/solicitud/equipo");
          break;
        default:
          setError("Usuario con rol no reconocido");
          break;
      }
    } catch (error) {
      if (error.message === "Invalid credentials") {
        setError("Usuario o contraseña incorrectos");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-blue-bg-gradient to-dim-blue-background">
        <header className="fixed top-0 w-full flex items-center justify-between px-4 sm:px-8 py-3 gap-4 overflow-hidden">
          <img
            src="/Logo.png"
            alt="Logo SEP"
            className="h-20 max-w-[30%] object-contain m-4"
          />
        </header>

        {/* Spheres for background */}
        <div className="fixed bottom-20 left-3 w-65 h-65 bg-sphere-blue opacity-50 blur-[100px] rounded-full z-0"></div>
        <div className="fixed top-10 right-3 w-65 h-65 bg-sphere-blue opacity-50 blur-[100px] rounded-full z-0"></div>

        <div className="w-full max-w-xl px-4 sm:px-8 z-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="flex flex-col w-full max-h-[70vh] mx-auto items-center justify-center text-center px-6 py-10 gap-10 bg-white rounded-2xl">
              <h1 className="text-3xl text-black font-semibold font-poppins">
                Iniciar Sesión
              </h1>
              <div className="flex flex-col items-center min-w-[80%] justify-center text-center gap-5 flex-grow overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col w-full text-1xl text-left gap-1 font-montserrat">
                  <span className="font-semibold">Clave de usuario</span>
                  <input
                    type="text"
                    ref={registrationNumberRef}
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="rounded-md p-1 border-2 border-gray-200 outline-none focus:border-input-focus focus:bg-input-background placeholder:text-sm placeholder:text-placeholder-text"
                    placeholder="Ingrese su clave de usuario"
                  ></input>
                </div>
                <div className="flex flex-col w-full text-1xl text-left gap-1 font-montserrat">
                  <span className="font-semibold">Contraseña</span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      ref={passwordRef}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      className="w-full rounded-md p-1 pr-10 border-2 border-gray-200 outline-none focus:border-input-focus focus:bg-input-background placeholder:text-sm placeholder:text-placeholder-text"
                      placeholder="Ingrese su contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black focus:outline-none cursor-pointer"
                      aria-label="Mostrar u ocultar contraseña"
                    >
                      <Icon
                        icon={
                          showPassword
                            ? "mdi:eye-off-outline"
                            : "mdi:eye-outline"
                        }
                        className="text-lg"
                      />
                      <span className="sr-only">
                        Mostrar u ocultar contraseña
                      </span>
                    </button>
                  </div>
                  <span className="mt-1 text-[15px] font-montserrat font-medium">
                    ¿No tiene una cuenta?{" "}
                    <button
                      type="button"
                      className="cursor-pointer text-dark-blue font-semibold hover:underline"
                      onClick={() => {
                        navigate("/registro");
                      }}
                      aria-label="Ir a registro"
                    >
                      Regístrese
                    </button>
                  </span>
                  {/* Mensaje de error */}
                  {error && (
                    <span className="font-montserrat font-semibold text-red-500 text-sm mt-1 text-center">
                      {error}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="rounded-md p-2 w-full items-center justify-center bg-primary-green text-white text-lg font-semibold font-poppins transition-all duration-200 hover:bg-login-btn-hover hover:scale-102 active:scale-95 cursor-pointer"
                  aria-label="Ingresar al sistema"
                >
                  Ingresar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
