import { motion } from "framer-motion";

export default function ViewModeSwitch({ viewMode, setViewMode }) {
  return (
    <div className="relative w-[120px] h-7 bg-toggle-switch rounded-full flex items-center px-[2px] py-[2px] font-semibold text-xs">
      <motion.div
        className="absolute h-5.5 w-[58px] rounded-full bg-dark-blue z-0"
        layout
        initial={false}
        animate={{
          x: viewMode === 0 ? 0 : 58,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <div className="flex justify-between w-full z-10">
        <button
          onClick={() => setViewMode(0)}
          className={`w-[58px] h-6 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
            viewMode === 0 ? "text-white" : "text-dark-gray"
          }`}
          aria-label="Cambiar a vista mensual"
        >
          Mensual
        </button>
        <button
          onClick={() => setViewMode(1)}
          className={`w-[58px] h-6 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
            viewMode === 1 ? "text-white" : "text-dark-gray"
          }`}
          aria-label="Cambiar a vista anual"
        >
          Anual
        </button>
      </div>
    </div>
  );
}
