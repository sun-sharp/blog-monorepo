import React, { useState, useEffect } from 'react';
import { MdCatalog } from 'md-editor-rt';
import './index.scss';

interface CatalogSlideProps {
  editorId: string;
  scrollElement: HTMLElement;
  visible: boolean;
  onClose: () => void;
}

const CatalogSlide: React.FC<CatalogSlideProps> = ({ editorId, scrollElement, visible, onClose }) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  return (
    <>
      {isVisible && (
        <div className="catalog-slide-mask" onClick={onClose} />
      )}
      <div className={`catalog-slide-container ${visible ? 'active' : ''}`}>
        <div className="catalog-slide-content">
          <MdCatalog editorId={editorId} scrollElement={scrollElement} />
        </div>
      </div>
    </>
  );
};

export default CatalogSlide;