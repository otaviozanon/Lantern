import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { Icon } from "@iconify/react";
import { useGame } from "../hooks/useGame";
import { useLanguage } from "../hooks/useLanguage";
import { ZONE_REQUIREMENTS } from "../constants/game";

const ZONE_ICONS: Record<number, string> = {
  1: "pixelarticons:dog",
  2: "pixelarticons:alien",
  3: "pixelarticons:building-community",
  4: "pixelarticons:skull",
  5: "pixelarticons:fire",
  6: "pixelarticons:bug",
  7: "pixelarticons:castle",
  8: "pixelarticons:skull",
  9: "pixelarticons:robot",
  10: "pixelarticons:fire",
  11: "pixelarticons:debug",
  12: "pixelarticons:script",
  13: "pixelarticons:magic-edit",
  14: "pixelarticons:building",
  15: "pixelarticons:t-rex",
};

const PAGE_0_ZONES = [1, 2, 3, 4, 5] as const;
const PAGE_1_ZONES = [6, 7, 8, 9, 10] as const;
const PAGE_2_ZONES = [11, 12, 13, 14, 15] as const;

const PAGE_0_POSITIONS: Record<number, { x: string; y: string }> = {
  1: { x: "4%",  y: "68%" },
  2: { x: "18%", y: "15%" },
  3: { x: "34%", y: "68%" },
  4: { x: "52%", y: "15%" },
  5: { x: "72%", y: "50%" },
};

const PAGE_1_POSITIONS: Record<number, { x: string; y: string }> = {
  6: { x: "4%",  y: "50%" },
  7: { x: "18%", y: "68%" },
  8: { x: "34%", y: "15%" },
  9: { x: "52%", y: "68%" },
  10: { x: "72%", y: "50%" },
};

const PAGE_2_POSITIONS: Record<number, { x: string; y: string }> = {
  11: { x: "4%",  y: "68%" },
  12: { x: "18%", y: "15%" },
  13: { x: "34%", y: "68%" },
  14: { x: "52%", y: "15%" },
  15: { x: "72%", y: "40%" },
};

function RequirementDice({ zone }: { zone: number }) {
  const req = ZONE_REQUIREMENTS[zone];
  if (!req) return null;
  if (req.rule === "bonfire") return null;

  if (req.rule === "fixed") {
    const faces: (number | "?")[] = [...req.fixed];
    while (faces.length < 6) faces.push("?");
    return (
      <div className="flex gap-[1px] mt-0.5">
        {faces.map((face, i) => (
          <div key={i} className={clsx(
            "w-[24px] h-[28px] rounded-[1px] flex items-center justify-center text-[7px] font-mono font-bold",
            face === "?" ? "bg-white/5 text-lantern-parchment/15 border border-white/5" : "bg-[#f5eedc]/30 text-lantern-parchment",
          )}>
            {face}
          </div>
        ))}
      </div>
    );
  }

  if (req.rule === "fixedWithGroup") {
    const faces: (number | "=" | "?")[] = [...req.fixed];
    const gs = req.groupSize || 0;
    for (let i = 0; i < gs; i++) faces.push("=");
    while (faces.length < 6) faces.push("?");
    return (
      <div className="flex gap-[1px] mt-0.5">
        {faces.map((face, i) => (
          <div key={i} className={clsx(
            "w-[24px] h-[28px] rounded-[1px] flex items-center justify-center text-[7px] font-mono font-bold",
            face === "?" ? "bg-white/5 text-lantern-parchment/15 border border-white/5"
              : face === "=" ? "bg-lantern-gold/20 text-lantern-gold/50 border border-lantern-gold/20"
              : "bg-[#f5eedc]/30 text-lantern-parchment",
          )}>
            {face}
          </div>
        ))}
      </div>
    );
  }

  if (req.rule === "fullHouse") {
    return (
      <div className="flex gap-[1px] mt-0.5">
        {[0, 1, 2].map((i) => (
          <div key={`a${i}`} className="w-[24px] h-[28px] rounded-[1px] flex items-center justify-center text-[6px] font-mono font-bold bg-lantern-gold/30 text-lantern-gold border border-lantern-gold/20">?</div>
        ))}
        {[0, 1, 2].map((i) => (
          <div key={`b${i}`} className="w-[24px] h-[28px] rounded-[1px] flex items-center justify-center text-[6px] font-mono font-bold bg-lantern-bronze/30 text-lantern-bronze border border-lantern-bronze/20">?</div>
        ))}
      </div>
    );
  }

  if (req.rule === "sextet") {
    return (
      <div className="flex gap-[1px] mt-0.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-[24px] h-[28px] rounded-[1px] flex items-center justify-center text-[6px] font-mono font-bold bg-lantern-ember/30 text-lantern-ember border border-lantern-ember/20">=</div>
        ))}
      </div>
    );
  }

  return null;
}

function ZoneMarker({ zone, positions }: { zone: number; positions: Record<number, { x: string; y: string }> }) {
  const { state } = useGame();
  const { t } = useLanguage();
  const { currentZone, clearedZones } = state;
  const icon = ZONE_ICONS[zone] || "pixelarticons:skull";
  const pos = positions[zone] || { x: "50%", y: "50%" };
  const isCleared = clearedZones[zone];
  const isActive = currentZone === zone;
  const isNext = zone === currentZone + 1;

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-0.5"
      style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
      initial={{ opacity: 0, scale: 0.5, x: 40 }}
      animate={{ opacity: isNext ? 0.4 : isCleared ? 0.5 : 1, scale: isActive ? 1.25 : 0.9, x: 0 }}
      transition={{ delay: 0.05, type: "spring", stiffness: 200, damping: 20 }}
    >
      <motion.div
        animate={{
          borderColor: isActive ? "#e8c34b" : isCleared ? "#5b9a4e" : isNext ? "rgba(212,197,169,0.15)" : "rgba(212,197,169,0.1)",
          boxShadow: isActive ? ["0 0 12px rgba(232,195,75,0.2)", "0 0 24px rgba(232,195,75,0.4)", "0 0 12px rgba(232,195,75,0.2)"] : "none",
        }}
        transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
        className={clsx(
          "w-12 h-12 flex items-center justify-center border-2 transition-colors",
          isActive ? "bg-lantern-bronze/20 shadow-lg rounded-full" : isCleared ? "bg-lantern-moss/20 rounded-none" : isNext ? "bg-lantern-dark/30 rounded-full" : "bg-lantern-dark/50 rounded-full"
        )}
      >
        <Icon icon={icon} className={clsx("w-5 h-5", isActive ? "text-lantern-gold" : isCleared ? "text-lantern-moss" : isNext ? "text-lantern-parchment/20" : "text-lantern-parchment/30")} />
      </motion.div>
      <RequirementDice zone={zone} />
      <span className={clsx("text-[7px] leading-none text-center max-w-[60px]", isActive ? "text-lantern-parchment/60" : "text-lantern-parchment/15")}>
        {isNext ? "???" : t(`zone${zone}` as any)}
      </span>
    </motion.div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

export const GameBoard: React.FC = () => {
  const { state } = useGame();
  const { phase, currentZone } = state;
  const shouldShow = phase !== "SETUP" && phase !== "GAME_OVER" && phase !== "VICTORY";
  if (!shouldShow) return null;

  const page = currentZone <= 5 ? 0 : currentZone <= 10 ? 1 : 2;

  return (
    <div className="flex-1 relative min-h-0 pt-8 pointer-events-none mb-10 overflow-hidden">
      <AnimatePresence mode="wait" custom={page}>
        <motion.div
          key={page}
          custom={page}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
          className="absolute inset-0 pt-8"
        >
          <div className="relative w-full h-full max-w-[85vw] mx-auto">
            {page === 0
              ? PAGE_0_ZONES.map(z => <ZoneMarker key={z} zone={z} positions={PAGE_0_POSITIONS} />)
              : page === 1
              ? PAGE_1_ZONES.map(z => <ZoneMarker key={z} zone={z} positions={PAGE_1_POSITIONS} />)
              : PAGE_2_ZONES.map(z => <ZoneMarker key={z} zone={z} positions={PAGE_2_POSITIONS} />)
            }
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
