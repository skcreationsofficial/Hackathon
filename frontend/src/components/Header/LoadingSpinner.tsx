import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";

const LottieLoader: React.FC<{ size?: number }> = ({ size = 150 }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 backdrop-blur-sm pointer-events-none">
      <Player
        autoplay
        loop
        src="https://assets1.lottiefiles.com/packages/lf20_usmfx6bp.json"
        style={{ height: size, width: size }}
      />
    </div>
  );
};

export default LottieLoader;