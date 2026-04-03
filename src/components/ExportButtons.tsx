import React, { memo, useCallback, useState } from 'react';
import { Download, ChevronDown, Copy, Check } from 'lucide-react';
import { ShoppingList } from '../types';
import { exportToCSV, exportToJSON, exportToText, copyToClipboard, generateShareLink } from '../utils/exportUtils';
import './ExportButtons.css';

interface ExportButtonsProps {
  shoppingList: ShoppingList;
}

export const ExportButtons = memo(function ExportButtons({ shoppingList }: ExportButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const handleExportCSV = useCallback(() => {
    exportToCSV(shoppingList);
    setIsOpen(false);
  }, [shoppingList]);

  const handleExportJSON = useCallback(() => {
    exportToJSON(shoppingList);
    setIsOpen(false);
  }, [shoppingList]);

  const handleExportText = useCallback(() => {
    exportToText(shoppingList);
    setIsOpen(false);
  }, [shoppingList]);

  const handleShareLink = useCallback(async () => {
    const link = generateShareLink(shoppingList);
    const copied = await copyToClipboard(link);
    if (copied) {
      setCopiedFormat('link');
      setTimeout(() => setCopiedFormat(null), 2000);
    }
    setIsOpen(false);
  }, [shoppingList]);

  return (
    <div className="export-buttons">
      <div className="export-dropdown">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="export-toggle"
          aria-label="Export options"
          aria-expanded={isOpen}
          title="Export your grocery list"
          type="button"
        >
          <Download size={20} aria-hidden="true" />
          <ChevronDown size={16} aria-hidden="true" className={`chevron ${isOpen ? 'open' : ''}`} />
        </button>

        {isOpen && (
          <div className="export-menu" role="menu" aria-label="Export format options">
            <button
              onClick={handleExportCSV}
              className="export-option"
              role="menuitem"
              title="Download as CSV spreadsheet"
              type="button"
            >
              <span>CSV</span>
              <span className="format-desc">Spreadsheet</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="export-option"
              role="menuitem"
              title="Download as JSON data"
              type="button"
            >
              <span>JSON</span>
              <span className="format-desc">Data format</span>
            </button>

            <button
              onClick={handleExportText}
              className="export-option"
              role="menuitem"
              title="Download as text file"
              type="button"
            >
              <span>Text</span>
              <span className="format-desc">Plain text</span>
            </button>

            <div className="export-divider" />

            <button
              onClick={handleShareLink}
              className={`export-option ${copiedFormat === 'link' ? 'copied' : ''}`}
              role="menuitem"
              title="Copy shareable link"
              type="button"
            >
              <span>{copiedFormat === 'link' ? 'Copied!' : 'Share Link'}</span>
              {copiedFormat === 'link' ? (
                <Check size={16} aria-hidden="true" className="icon-check" />
              ) : (
                <Copy size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
