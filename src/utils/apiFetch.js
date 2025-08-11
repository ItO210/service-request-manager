export const baseUrl = `http://${import.meta.env.VITE_SERVER_IP}/v1`;

export const apiFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const isFormData = options.body instanceof FormData;
    const isBlob = options.responseType === "blob";

    const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
    };

    const config = {
        ...options,
        headers,
    };

    delete config.responseType;

    const response = await fetch(`${baseUrl}${url}`, config);

    if (response.status === 401 || response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || errorData.error || "No autorizado");
        error.status = response.status;
        throw error;
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || errorData.error || "Error en la solicitud");
        error.status = response.status;
        throw error;
    }

    return isBlob ? response.blob() : response.json();
};
