/**
 * PSM1052D00 - ê²½ë ¥ ?ë ¥ ì»´í¬?í¸ ?ì¤??
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PSM1052D00 from './PSM1052D00';

describe('PSM1052D00 - ê²½ë ¥ ?ë ¥ ì»´í¬?í¸', () => {
  test('ì»´í¬?í¸ê° ?ì?ì¼ë¡??ëë§ë??, () => {
    render(<PSM1052D00 />);
    
    expect(screen.getByText('???ì¬??ê²½ë ¥ (?ì¬?¸ë ¥) - ?ì¬ ???ë¡?í¸ ?¬ì ê¸°ê°??ë§í¨.')).toBeInTheDocument();
  });

  test('ì£¼ì ?ë´ ë¬¸êµ¬?¤ì´ ?ì?ë¤', () => {
    render(<PSM1052D00 />);
    
    // ?µì¬ ë¬¸êµ¬?¤ë§ ?ì¸
    expect(screen.getByText(/???ì¬??ê²½ë ¥ \(?ì¬?¸ë ¥\)/)).toBeInTheDocument();
    expect(screen.getByText(/???ì¬??ê²½ë ¥ \(?ì¬?¸ë ¥\)/)).toBeInTheDocument();
    expect(screen.getByText(/???¸ì£¼?¸ë ¥?/)).toBeInTheDocument();
  });

  test('ì»´í¬?í¸ê° ?ë???ë°°ê²½?¼ë¡ ?ì?ë¤', () => {
    render(<PSM1052D00 />);
    
    const container = screen.getByText('???ì¬??ê²½ë ¥ (?ì¬?¸ë ¥) - ?ì¬ ???ë¡?í¸ ?¬ì ê¸°ê°??ë§í¨.').closest('div')?.parentElement;
    expect(container).toHaveClass('bg-blue-50');
  });

  test('propsê° ?ì´???ì ?ì?ë¤', () => {
    expect(() => {
      render(<PSM1052D00 />);
    }).not.toThrow();
  });
}); 

