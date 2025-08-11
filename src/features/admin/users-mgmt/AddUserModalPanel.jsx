import { useEffect, useRef } from "react";
import AddUserPanel from "./AddUserPanel";
export default function AddUserModalPanel({
  onClose,
  selectedUser,
  setReload,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray backdrop-blur-xs flex items-center justify-center z-50">
      <div
        ref={panelRef}
        className="bg-white max-h-[90vh] overflow-y-auto rounded-xl shadow-lg w-[95%] max-w-6xl animate-fade-in"
      >
        <AddUserPanel
          onClose={onClose}
          initialData={selectedUser}
          isEditing={!!selectedUser}
          setReload={setReload}
        />
      </div>
    </div>
  );
}
