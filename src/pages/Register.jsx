import { apiFetch } from "@/utils/apiFetch";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { showToast } from "@/utils/toastUtils";
import { ROLES } from "@/constants/roles";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    email: "",
    password: "",
    role: ROLES.USER,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const nameRef = useRef(null);
  const regNumberRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const blockEnie = (e) => {
    if (e.key.toLowerCase() === "ñ") {
      e.preventDefault();
    }
  };
  const blockNum = (e) => {
    if (/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let sanitizedValue = value;
    if (name === "name") {
      sanitizedValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    } else {
      sanitizedValue = value.replace(/\s+/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleRegister = async () => {
    setGlobalError(""); // Limpiar el error

    // Validaciones previas
    // if (!formData.name || !formData.registrationNumber || !formData.email || !formData.password) {
    //     setError("Todos los campos son requeridos.");
    //     return;
    // }
    // if (formData.password.length < 6) {
    //     setError("La contraseña debe tener al menos 6 caracteres.");
    //     return;
    // }
    // if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //     setError("Por favor ingresa un correo electrónico válido.");
    //     return;
    // }

    const newErrors = {
      name: !formData.name.trim(),
      registrationNumber: !formData.registrationNumber.trim(),
      email: (() => {
        if (formData.email.trim() === "") return "Este campo es obligatorio";
        if (!/\S+@\S+\.\S+/.test(formData.email))
          return "Correo no válido: example@ipn.mx";
        return "";
      })(),
      password: !formData.password.trim()
        ? "Este campo es obligatorio"
        : formData.password.length < 6
          ? "La contraseña debe tener al menos 6 caracteres"
          : "",
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      if (newErrors.name) nameRef.current?.focus();
      else if (newErrors.registrationNumber) regNumberRef.current?.focus();
      else if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.password) passwordRef.current?.focus();
      return;
    }

    try {
      const trimmedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value.trim()]),
      );

      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(trimmedData),
      });

      navigate("/");
      showToast("Usuario registrado correctamente", "success");
    } catch (error) {
      if (
        error.message ===
        "Failed to create user: registrationNumber already exists"
      ) {
        showToast("La clave de usuario ya existe", "error");
      } else if (
        error.message === "Failed to create user: Email already in use"
      ) {
        showToast("El correo electrónico ya existe", "error");
      } else {
        showToast("Error al agregar usuario", "error");
      }
      throw new Error("Error al agregar usuario");
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-bg-gradient to-dim-blue-background">
        <header className="fixed top-0 w-full flex items-center justify-between px-4 sm:px-8 py-3 gap-4 overflow-hidden">
          <img
            src="/Logo.png"
            alt="Logo SEP"
            className="h-12 max-w-[30%] object-contain"
          />
        </header>

        {/* Spheres for background */}
        <div className="fixed bottom-20 left-3 w-65 h-65 bg-sphere-blue opacity-50 blur-[100px] rounded-full z-0"></div>
        <div className="fixed top-10 right-3 w-65 h-65 bg-sphere-blue opacity-50 blur-[100px] rounded-full z-0"></div>

        <div className="w-full max-w-xl px-4 sm:px-8 z-10 pt-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <div className="flex flex-col w-full max-h-fit mx-auto items-center justify-center text-center px-6 py-10 gap-10 bg-white rounded-2xl">
              <h1 className="text-3xl text-black font-semibold font-poppins">
                Crear una cuenta
              </h1>
              <div className="flex flex-col items-center min-w-[80%] justify-center text-center gap-5 flex-grow overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col w-full text-1xl text-left gap-1 font-montserrat">
                  <span className="font-semibold">
                    Nombre completo <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    ref={nameRef}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-md p-1 border-2 border-gray-200 outline-none focus:border-input-focus focus:bg-input-background placeholder:text-sm placeholder:text-placeholder-text"
                    placeholder="Ingrese su nombre completo"
                  />
                  {errors.name && (
                    <span className="font-montserrat font-semibold text-red-500 text-sm">
                      Este campo es obligatorio
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full text-1xl text-left gap-1 font-montserrat">
                  <span className="font-semibold">
                    Clave de usuario <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    ref={regNumberRef}
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="rounded-md p-1 border-2 border-gray-200 outline-none focus:border-input-focus focus:bg-input-background placeholder:text-sm placeholder:text-placeholder-text"
                    placeholder="Ingrese su clave de usuario"
                  />
                  {errors.registrationNumber && (
                    <span className="font-montserrat font-semibold text-red-500 text-sm">
                      Este campo es obligatorio
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full text-1xl text-left gap-1 font-montserrat">
                  <span className="font-semibold">
                    Correo electrónico <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="email"
                    ref={emailRef}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-md p-1 border-2 border-gray-200 outline-none focus:border-input-focus focus:bg-input-background placeholder:text-sm placeholder:text-placeholder-text"
                    placeholder="Ingrese su correo electrónico"
                    onKeyDown={blockEnie}
                  />
                  {errors.email && (
                    <span className="font-montserrat font-semibold text-red-500 text-sm">
                      {errors.email}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full text-1xl text-left gap-1 font-montserrat">
                  <span className="font-semibold">
                    Contraseña <span className="text-red-500">*</span>
                  </span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      ref={passwordRef}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
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
                  {errors.password && (
                    <span className="font-montserrat font-semibold text-red-500 text-sm">
                      {errors.password}
                    </span>
                  )}
                  <span className="mt-1 text-[15px] font-montserrat font-medium">
                    ¿Ya tiene una cuenta?{" "}
                    <button
                      type="button"
                      className="cursor-pointer text-dark-blue font-semibold hover:underline"
                      onClick={() => {
                        navigate("/");
                      }}
                      aria-label="Ir a la página de inicio de sesión"
                    >
                      Entrar
                    </button>
                  </span>
                  {/* Mensaje de error */}
                  {globalError && (
                    <span className="font-montserrat font-semibold text-red-500 text-sm mt-1 text-center">
                      {globalError}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="rounded-md p-2 w-full items-center justify-center bg-primary-green text-white text-lg font-semibold font-poppins transition-all duration-200 hover:bg-login-btn-hover hover:scale-102 active:scale-95 cursor-pointer"
                  aria-label="Crear cuenta"
                >
                  Crear cuenta
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
