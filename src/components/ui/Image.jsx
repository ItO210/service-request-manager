import { useEffect, useState } from "react";

export default function TokenImage({ src, alt = "", className = "" }) {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(src, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Error al cargar la imagen");
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
            } catch (error) {
                console.error("No se pudo cargar la imagen:", error);
            }
        };

        if (src) fetchImage();
    }, [src]);

    if (!imageUrl) return null;

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={className}
        />
    );
}
