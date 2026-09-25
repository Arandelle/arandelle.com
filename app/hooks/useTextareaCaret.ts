import { useCallback } from "react";


export function useTextareaCaret() {
  const getCaretCoordinates = useCallback((textarea: HTMLTextAreaElement) => {
    if (!textarea) return { x: 0, y: 0 };

    const selectionStart = textarea.selectionStart;
    
    // 1. Create a dummy mirror element
    const mirror = document.createElement('div');
    document.body.appendChild(mirror);
    
    // 2. Clone styling
    const style = window.getComputedStyle(textarea);
    const propertiesToCopy = [    
      'direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY',
      'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 
      'lineHeight', 'fontFamily', 'textAlign', 'textTransform', 'textIndent',
      'textDecoration', 'letterSpacing', 'wordSpacing', 'whiteSpace', 'wordBreak'
    ];
    
    propertiesToCopy.forEach(prop => {
      (mirror.style as unknown as Record<string, string>)[prop] = (style as unknown as Record<string, string>)[prop];
    });
    
    mirror.style.position = 'absolute';
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre-wrap';
    mirror.style.wordWrap = 'break-word';

    // 3. Insert text data split by caret index
    mirror.textContent = textarea.value.substring(0, selectionStart);
    
    const markerSpan = document.createElement('span');
    markerSpan.textContent = textarea.value.substring(selectionStart) || '.';
    mirror.appendChild(markerSpan);
    
    // 4. Geometry calculations
    const textareaRect = textarea.getBoundingClientRect();
    const markerRect = markerSpan.getBoundingClientRect();
    const mirrorRect = mirror.getBoundingClientRect();

    const x = textareaRect.left + (markerRect.left - mirrorRect.left) - textarea.scrollLeft + window.scrollX;
    const y = textareaRect.top + (markerRect.top - mirrorRect.top) - textarea.scrollTop + window.scrollY;
    
    document.body.removeChild(mirror);
    
    return { x, y };
  }, []);

  return { getCaretCoordinates };
}