import React from "react";
import { motion } from "framer-motion";
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
  8: "pixelarticons:t-rex",
};

const ZONE_POSITIONS: Record<number, { x: string; y: string }> = {
  1: { x: "0%", y: "70%" },
  2: { x: "12%", y: "10%" },
  3: { x: "24%", y: "70%" },
  4: { x: "36%", y: "10%" },
  5: { x: "52%", y: "45%" },
  6: { x: "60%", y: "70%" },
  7: { x: "72%", y: "10%" },
  8: { x: "86%", y: "38%" },
};

function getZonePosition(
  zone: number,
  totalVisible: number,
  idx: number,
): { x: string; y: string } {
  if (totalVisible <= 3) {
    const positions = [
      { x: "10%", y: "80%" },
      { x: "35%", y: "35%" },
      { x: "60%", y: "78%" },
    ];
    return positions[idx] || positions[positions.length - 1];
  }
  if (totalVisible <= 5) {
    const positions = [
      { x: "8%", y: "80%" },
      { x: "22%", y: "32%" },
      { x: "36%", y: "80%" },
      { x: "52%", y: "32%" },
      { x: "66%", y: "50%" },
    ];
    return positions[idx] || positions[positions.length - 1];
  }
  return ZONE_POSITIONS[zone] || { x: "50%", y: "50%" };
}

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
          <div
            key={i}
            className={clsx(
              "w-[24px] h-[28px] rounded-[1px] flex items-center justify-center text-[7px] font-mono font-bold",
              face === "?"
                ? "bg-white/5 text-lantern-parchment/15 border border-white/5"
                : "bg-[#f5eedc]/30 text-lantern-parchment",
            )}
          >
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
          <div
            key={i}
            className={clsx(
              "w-[24px] h-[28px] rounded-[1px] flex items-center justify-center text-[7px] font-mono font-bold",
              face === "?"
                ? "bg-white/5 text-lantern-parchment/15 border border-white/5"
                : face === "="
                  ? "bg-lantern-gold/20 text-lantern-gold/50 border border-lantern-gold/20"
                  : "bg-[#f5eedc]/30 text-lantern-parchment",
            )}
          >
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
          <div
            key={`a${i}`}
            className="w-[24px] h-[28px] rounded-[1px] flex items-center justify-center text-[6px] font-mono font-bold bg-lantern-gold/30 text-lantern-gold border border-lantern-gold/20"
          >
            ?
          </div>
        ))}
        {[0, 1, 2].map((i) => (
          <div
            key={`b${i}`}
            className="w-[24px] h-[28px] rounded-[1px] flex items-center justify-center text-[6px] font-mono font-bold bg-lantern-bronze/30 text-lantern-bronze border border-lantern-bronze/20"
          >
            ?
          </div>
        ))}
      </div>
    );
  }

  if (req.rule === "sextet") {
    return (
      <div className="flex gap-[1px] mt-0.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-[24px] h-[28px] rounded-[1px] flex items-center justify-center text-[6px] font-mono font-bold bg-lantern-ember/30 text-lantern-ember border border-lantern-ember/20"
          >
            =
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export const GameBoard: React.FC = () => {
  const { state } = useGame();
  const { t } = useLanguage();
  const { phase, currentZone, clearedZones } = state;
  const shouldShow =
    phase !== "SETUP" && phase !== "GAME_OVER" && phase !== "VICTORY";
  if (!shouldShow) return null;

  const allZones = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="flex-1 relative min-h-0 pt-8 pointer-events-none mb-10">
      <div className="relative w-full h-full max-w-[60vw] mx-auto pl-2">
        {allZones.map((zone, idx) => {
          const icon = ZONE_ICONS[zone] || "pixelarticons:skull";
          const pos = getZonePosition(zone, allZones.length, idx);
          const isCleared = clearedZones[zone];
          const isActive = currentZone === zone;
          const isNext = zone === currentZone + 1;

          return (
            <motion.div
              key={zone}
              className="absolute flex flex-col items-center gap-0.5"
              style={{
                left: pos.x,
                top: pos.y,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: isNext ? 0.4 : isCleared ? 0.5 : 1,
                scale: isActive ? 1.25 : 0.9,
              }}
              transition={{
                delay: idx * 0.08,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <motion.div
                animate={{
                  borderColor: isActive
                    ? "#e8c34b"
                    : isCleared
                      ? "#5b9a4e"
                      : isNext
                        ? "rgba(212,197,169,0.15)"
                        : "rgba(212,197,169,0.1)",
                  boxShadow: isActive
                    ? [
                        "0 0 12px rgba(232,195,75,0.2)",
                        "0 0 24px rgba(232,195,75,0.4)",
                        "0 0 12px rgba(232,195,75,0.2)",
                      ]
                    : "none",
                }}
                transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                className={clsx(
                  "w-12 h-12 flex items-center justify-center border-2 transition-colors",
                  isActive
                    ? "bg-lantern-bronze/20 shadow-lg rounded-full"
                    : isCleared
                      ? "bg-lantern-moss/20 rounded-none"
                      : isNext
                        ? "bg-lantern-dark/30 rounded-full"
                        : "bg-lantern-dark/50 rounded-full",
                )}
              >
                <Icon
                  icon={icon}
                  className={clsx(
                    "w-5 h-5",
                    isActive
                      ? "text-lantern-gold"
                      : isCleared
                        ? "text-lantern-moss"
                        : isNext
                          ? "text-lantern-parchment/20"
                          : "text-lantern-parchment/30",
                  )}
                />
              </motion.div>

              <RequirementDice zone={zone} />

              <span
                className={clsx(
                  "text-[7px] leading-none text-center max-w-[60px]",
                  isActive
                    ? "text-lantern-parchment/60"
                    : "text-lantern-parchment/15",
                )}
              >
                {isNext ? "???" : t(`zone${zone}` as any)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
