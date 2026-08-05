import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { Icon } from "@iconify/react";
import { useGame } from "../hooks/useGame";
import { useLanguage } from "../hooks/useLanguage";
import { getZoneRequirements } from "../constants/game";
import { GameTooltip } from './GameTooltip';

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

const POSITION_TEMPLATES: { x: string; y: string }[] = [
  { x: "4%",  y: "68%" },
  { x: "18%", y: "15%" },
  { x: "34%", y: "68%" },
  { x: "52%", y: "15%" },
  { x: "72%", y: "50%" },
];

function buildPages(totalZones: number) {
  const pages: number[][] = [];
  for (let i = 1; i <= totalZones; i += 5) {
    pages.push(Array.from({ length: Math.min(5, totalZones - i + 1) }, (_, j) => i + j));
  }
  return pages;
}

function RequirementDice({ zone }: { zone: number }) {
  const { state } = useGame();
  const req = getZoneRequirements(state.difficulty)[zone];
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
  const reqs = getZoneRequirements(state.difficulty);
  const reqData = reqs[zone];

  let tooltipText = '';
  if (reqData) {
    const wc = 6 - reqData.fixed.length - (reqData.groupSize || 0);
    switch (reqData.rule) {
      case 'fixed': tooltipText = `Zona ${zone}: ${reqData.fixed.join(', ')} + ${wc} dados quaisquer`; break;
      case 'fixedWithGroup': tooltipText = `Zona ${zone}: ${reqData.fixed.join(', ')} + ${reqData.groupSize} dados idênticos`; break;
      case 'fullHouse': tooltipText = `Zona ${zone}: Full House (3+3 iguais)`; break;
      case 'bonfire': tooltipText = `Zona ${zone}: Fogueira — descanso`; break;
      case 'sextet': tooltipText = `Zona ${zone}: Sexteto (6 dados idênticos)`; break;
    }
  }

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-0.5 pointer-events-auto group cursor-help"
      title={tooltipText}
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
        {isNext ? "???" : t(`zone${zone}`)}
      </span>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-lantern-dark border border-lantern-gold/30 px-2 py-1 text-[9px] font-pixel-sans text-lantern-gold shadow-lg z-50">
        {tooltipText}
      </div>
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
  const { t } = useLanguage();
  const { phase, currentZone } = state;
  const shouldShow = phase !== "SETUP" && phase !== "GAME_OVER" && phase !== "VICTORY";
  if (!shouldShow) return null;

  const totalZones = state.difficulty === 'hard' ? 15 : 8;
  const pages = buildPages(totalZones);
  const page = pages.findIndex(p => p.includes(currentZone));
  const currentPage = page >= 0 ? page : 0;

  const positions: Record<number, { x: string; y: string }> = {};
  pages[currentPage]?.forEach((zone, i) => {
    positions[zone] = POSITION_TEMPLATES[i] || POSITION_TEMPLATES[4];
  });

  return (
    <div className="flex-1 relative min-h-0 pt-8 pointer-events-none mb-10 overflow-hidden">
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[400]">
        <GameTooltip message={t('tooltipMap')} position="bottom" />
      </div>
      <AnimatePresence mode="wait" custom={currentPage}>
        <motion.div
          key={currentPage}
          custom={currentPage}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
          className="absolute inset-0 pt-8"
        >
          <div className="relative w-full h-full max-w-[85vw] mx-auto">
            {pages[currentPage]?.map(z => (
              <ZoneMarker key={z} zone={z} positions={positions} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
