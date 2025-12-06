import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import {
  createAgents,
  moveAgent,
  agentsCollide,
  resolveCollision,
  allSameType,
  countByType,
} from "./rps";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_BACKGROUND,
  CANVAS_BORDER_RADIUS,
  BALLS_PER_TYPE,
  BALL_RADIUS,
  BALL_SPEED,
  MAX_BALLS_PER_TYPE,
  SPAWN_COOLDOWN_FRAMES,
  ICON_FILL_COLOR,
  ICON_SCALE,
  ICON_VIEWBOX,
  BALL_COLORS,
  OVERLAY_BACKGROUND,
  OVERLAY_BLUR,
  OVERLAY_TEXT_COLOR,
  OVERLAY_TEXT_SIZE,
  OVERLAY_TEXT_WEIGHT,
  OVERLAY_TEXT_SHADOW,
  OVERLAY_EMOJI_SIZE,
} from "./config";
import { ICONS } from "./assets/svg-paths";
import type { Agent } from "./Agent";

export default function Simulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const gameEndedRef = useRef(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const width = canvas.width;
    const height = canvas.height;

    const agents: Agent[] = createAgents(BALLS_PER_TYPE, width, height);

    function loop() {
      if (gameEndedRef.current) return;
      if (winner) return;

      ctx.clearRect(0, 0, width, height);

      // move and draw agents
      agents.forEach((agent) => {
        moveAgent(agent, width, height);

        ctx.fillStyle = agent.color;
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, agent.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw icon
        const icons = ICONS[agent.type];
        const viewBox = ICON_VIEWBOX[agent.type];

        ctx.save();
        ctx.translate(agent.x, agent.y);

        // Scale to fit inside the circle with configurable size
        const maxDim = Math.max(viewBox.width, viewBox.height);
        const scale = ((agent.radius * 2) * ICON_SCALE) / maxDim;
        ctx.scale(scale, scale);

        // Center the icon
        ctx.translate(
          -viewBox.width / 2 - viewBox.offsetX,
          -viewBox.height / 2 - viewBox.offsetY
        );

        // Draw each path with configured color
        ctx.fillStyle = ICON_FILL_COLOR;
        icons.forEach((p) => ctx.fill(p));

        ctx.restore();
      });

      // Decrement cooldowns for all agents
      agents.forEach((agent) => {
        if (agent.spawnCooldown && agent.spawnCooldown > 0) {
          agent.spawnCooldown--;
        }
      });

      // check collisions
      const spawnQueue: Array<{ type: Agent["type"]; x: number; y: number }> = [];
      const typeCounts = countByType(agents);

      for (let i = 0; i < agents.length; i++) {
        for (let j = i + 1; j < agents.length; j++) {
          if (agentsCollide(agents[i], agents[j])) {
            const a = agents[i];
            const b = agents[j];

            // Same-type collision spawning
            if (a.type === b.type) {
              // Check cooldown - both balls must be off cooldown
              const aCooldown = a.spawnCooldown ?? 0;
              const bCooldown = b.spawnCooldown ?? 0;

              if (aCooldown === 0 && bCooldown === 0) {
                // Check limit (including already-queued spawns of this type)
                const queuedOfType = spawnQueue.filter(s => s.type === a.type).length;
                const totalOfType = typeCounts[a.type] + queuedOfType;

                if (totalOfType < MAX_BALLS_PER_TYPE) {
                  // Calculate midpoint with small random offset to prevent immediate re-collision
                  const midX = (a.x + b.x) / 2;
                  const midY = (a.y + b.y) / 2;
                  const offsetX = (Math.random() - 0.5) * BALL_RADIUS;
                  const offsetY = (Math.random() - 0.5) * BALL_RADIUS;

                  // Clamp to canvas bounds
                  const spawnX = Math.max(BALL_RADIUS, Math.min(width - BALL_RADIUS, midX + offsetX));
                  const spawnY = Math.max(BALL_RADIUS, Math.min(height - BALL_RADIUS, midY + offsetY));

                  spawnQueue.push({ type: a.type, x: spawnX, y: spawnY });

                  // Set cooldown for both balls
                  a.spawnCooldown = SPAWN_COOLDOWN_FRAMES;
                  b.spawnCooldown = SPAWN_COOLDOWN_FRAMES;
                }
              }
            }

            // Apply existing physics (separation + velocity swap)
            resolveCollision(a, b);
          }
        }
      }

      // Spawn new balls after collision loop completes
      spawnQueue.forEach(spawn => {
        const angle = Math.random() * Math.PI * 2;
        agents.push({
          x: spawn.x,
          y: spawn.y,
          dx: Math.cos(angle) * BALL_SPEED,
          dy: Math.sin(angle) * BALL_SPEED,
          radius: BALL_RADIUS,
          type: spawn.type,
          color: BALL_COLORS[spawn.type],
          spawnCooldown: SPAWN_COOLDOWN_FRAMES, // Initialize with cooldown
        });
      });

      // check end condition
      if (allSameType(agents)) {
        gameEndedRef.current = true;
        setWinner(agents[0].type);
        return;
      } else {
        requestAnimationFrame(loop);
      }
    }

    requestAnimationFrame(loop);
  }, [winner]);

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          borderRadius: CANVAS_BORDER_RADIUS,
          background: CANVAS_BACKGROUND,
        }}
      />

      {winner && (
        <>
          <Confetti
            width={windowWidth}
            height={windowHeight}
            recycle={true}
            numberOfPieces={200}
            gravity={0.3}
          />

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: OVERLAY_BACKGROUND,
              backdropFilter: `blur(${OVERLAY_BLUR})`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontSize: OVERLAY_EMOJI_SIZE,
                marginBottom: "20px",
              }}
            >
              🎉
            </div>
            <div
              style={{
                color: OVERLAY_TEXT_COLOR,
                fontSize: OVERLAY_TEXT_SIZE,
                fontWeight: OVERLAY_TEXT_WEIGHT,
                textShadow: OVERLAY_TEXT_SHADOW,
                textTransform: "uppercase",
                letterSpacing: "4px",
              }}
            >
              {winner} Wins!
            </div>
          </div>
        </>
      )}
    </div>
  );
}
