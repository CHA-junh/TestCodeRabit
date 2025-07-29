'use client';

import React from 'react';
import SYS1010D00 from '../SYS1010D00';
import styles from './SYS1010D00.module.css';

interface Program {
  PGM_ID: string;
  PGM_NM: string;
  PGM_DIV_CD: string;
  BIZ_DIV_CD: string;
  USE_YN: string;
}

interface SYS1010D00PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (selectedPrograms: Program[]) => void;
  multiple?: boolean;
  title?: string;
}

export default function SYS1010D00Popup({ 
  isOpen, 
  onClose, 
  onSelect, 
  multiple = true,
  title = "프로그램 선택"
}: SYS1010D00PopupProps) {
  if (!isOpen) return null;

  const handleSelect = (selectedPrograms: Program[]) => {
    if (onSelect) {
      onSelect(selectedPrograms);
    }
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.popupOverlay} onClick={handleOverlayClick}>
      <div className={styles.popupContainer}>
        <div className={styles.popupHeader}>
          <span className={styles.popupTitle}>{title}</span>
          <button 
            className={styles.popupClose} 
            type="button"
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </div>
        <div className={styles.popupContent}>
          <SYS1010D00 
            onSelect={handleSelect}
            multiple={multiple}
          />
        </div>
      </div>
    </div>
  );
} 