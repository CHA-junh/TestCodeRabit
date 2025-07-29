/**
 * PSM1052D00 - ê²½ë ¥ ?…ë ¥ ì»´í¬?ŒíŠ¸ ?ŒìŠ¤??
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PSM1052D00 from './PSM1052D00';

describe('PSM1052D00 - ê²½ë ¥ ?…ë ¥ ì»´í¬?ŒíŠ¸', () => {
  test('ì»´í¬?ŒíŠ¸ê°€ ?•ìƒ?ìœ¼ë¡??Œë”ë§ëœ??, () => {
    render(<PSM1052D00 />);
    
    expect(screen.getByText('???…ì‚¬??ê²½ë ¥ (?ì‚¬?¸ë ¥) - ?…ì‚¬ ???„ë¡œ?íŠ¸ ?¬ì… ê¸°ê°„??ë§í•¨.')).toBeInTheDocument();
  });

  test('ì£¼ìš” ?ˆë‚´ ë¬¸êµ¬?¤ì´ ?œì‹œ?œë‹¤', () => {
    render(<PSM1052D00 />);
    
    // ?µì‹¬ ë¬¸êµ¬?¤ë§Œ ?•ì¸
    expect(screen.getByText(/???…ì‚¬??ê²½ë ¥ \(?ì‚¬?¸ë ¥\)/)).toBeInTheDocument();
    expect(screen.getByText(/???…ì‚¬??ê²½ë ¥ \(?ì‚¬?¸ë ¥\)/)).toBeInTheDocument();
    expect(screen.getByText(/???¸ì£¼?¸ë ¥?€/)).toBeInTheDocument();
  });

  test('ì»´í¬?ŒíŠ¸ê°€ ?Œë???ë°°ê²½?¼ë¡œ ?œì‹œ?œë‹¤', () => {
    render(<PSM1052D00 />);
    
    const container = screen.getByText('???…ì‚¬??ê²½ë ¥ (?ì‚¬?¸ë ¥) - ?…ì‚¬ ???„ë¡œ?íŠ¸ ?¬ì… ê¸°ê°„??ë§í•¨.').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-blue-50');
  });

  test('propsê°€ ?†ì–´???•ìƒ ?™ì‘?œë‹¤', () => {
    expect(() => {
      render(<PSM1052D00 />);
    }).not.toThrow();
  });
}); 

