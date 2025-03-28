import { useState } from "react";
import { motion } from "framer-motion";

const BouncingBall = () => {
  const [position, setPosition] = useState(500);

  const handleTap = () => {
    setPosition((prev) => Math.max(prev - 50));
    console.log(position);
  };

  const handleDropBall = () => {
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

// import { useState } from "react";
// import { motion } from "framer-motion";

// const BouncingBall = () => {
//   const [fall, setFall] = useState(false);

//   return (
//     <>
//       <motion.div
//         className="ball"
//         initial={{ y: 0 }}
//         animate={{ y: fall ? 300 : 0 }}
//         transition={{ type: "spring", stiffness: 50, damping: 10 }}
//       />
//     </>
//   );
// };

// export default BouncingBall;
