import { createContext, useContext, useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import PropTypes from "prop-types";
import { BASE_URL } from "../Services/Helper";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    const socket = socketIOClient(`${BASE_URL}`);
    setSocketInstance(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
