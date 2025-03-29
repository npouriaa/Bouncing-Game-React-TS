import { useState } from "react";
import { motion } from "framer-motion";

const BouncingBall = () => {
  const [position, setPosition] = useState<number>(500);
  const [timeoutId, setTimeoutId] = useState<number>(0);

  const handleTap = () => {
    setPosition((prev) => Math.max(prev - 50));

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = window.setTimeout(() => {
      setPosition(500);
    }, 200);

    setTimeoutId(newTimeoutId);
  };

  const handleDropBall = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setPosition(500);
  };

  return (
    <>
      <div className="container" onClick={() => handleTap()}>
        <motion.div
          className="ball"
          initial={{ y: 550 }}
          animate={{ y: position }}
          transition={{ type: "spring", stiffness: 150, damping: 10 }}
        />
      </div>
      <button className="button" onClick={() => handleDropBall()}>
        Drop Ball
      </button>
    </>
  );
};

export default BouncingBall;