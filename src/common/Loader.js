import React from "react";
import { RingLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
      {/* <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
      <style jsx>{`
        .loader {
          border: 4px solid rgba(0, 0, 0, 0.1);
        }
      `}</style> */}

<RingLoader
  color="#439BFF"
  speedMultiplier={1}
/>
    </div>
  );
};

export default Loader;
