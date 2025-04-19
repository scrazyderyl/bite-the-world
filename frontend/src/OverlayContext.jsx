import React, { createContext, useContext, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';

const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
  const [overlays, setOverlays] = useState([]);

  const showOverlay = useCallback((id, content) => {
    setOverlays((prev) => [...prev, { id, content }]);
  }, []);

  const hideOverlay = useCallback((id) => {
    setOverlays((prev) => prev.filter(overlay => overlay.id !== id));
  }, []);

  return (
    <OverlayContext.Provider value={{ showOverlay, hideOverlay }}>
      {children}
      {ReactDOM.createPortal(
      <div className="overlay-root">
        {overlays.map(({ id, content }) => (
          <div key={id} className="overlay-background" onClick={() => hideOverlay(id)}>
            <div className="overlay-content" onClick={(e) => e.stopPropagation()} >
              {content}
            </div>
          </div>
        ))}
      </div>,
      document.body
      )}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => useContext(OverlayContext);