import React, { memo, useCallback, useState } from 'react';
import { Copy, X } from 'lucide-react';
import { getTemplateList, createListFromTemplate, TemplateKey } from '../utils/listTemplates';
import { GroceryItem } from '../types';
import './TemplateSelector.css';

interface TemplateSelectorProps {
  onLoadTemplate: (items: GroceryItem[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateSelector = memo(function TemplateSelector({
  onLoadTemplate,
  isOpen,
  onClose,
}: TemplateSelectorProps) {
  const templates = getTemplateList();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey | null>(null);

  const handleSelectTemplate = useCallback((key: TemplateKey) => {
    setSelectedTemplate(key);
  }, []);

  const handleLoadTemplate = useCallback(() => {
    if (selectedTemplate) {
      const list = createListFromTemplate(selectedTemplate);
      onLoadTemplate(list.items);
      setSelectedTemplate(null);
      onClose();
    }
  }, [selectedTemplate, onLoadTemplate, onClose]);

  const handleClose = useCallback(() => {
    setSelectedTemplate(null);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="template-selector-overlay" onClick={handleClose} role="presentation">
      <div className="template-modal" onClick={(e) => e.stopPropagation()}>
        <div className="template-header">
          <h2 id="template-modal-title">Choose a Template</h2>
          <button
            onClick={handleClose}
            className="template-close-btn"
            aria-label="Close template selector"
            title="Close"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <div className="template-description">
          <p>Start with a pre-built template and customize it for your needs.</p>
        </div>

        <div className="templates-grid">
          {templates.map((template) => (
            <button
              key={template.key}
              onClick={() => handleSelectTemplate(template.key)}
              className={`template-card ${selectedTemplate === template.key ? 'selected' : ''}`}
              role="option"
              aria-selected={selectedTemplate === template.key}
              type="button"
            >
              <div className="template-card-icon">
                <Copy size={32} aria-hidden="true" />
              </div>
              <h3>{template.name}</h3>
              <p className="template-desc">{template.description}</p>
              <div className="template-card-select">
                <div className={`checkbox ${selectedTemplate === template.key ? 'checked' : ''}`} />
              </div>
            </button>
          ))}
        </div>

        <div className="template-actions">
          <button
            onClick={handleClose}
            className="btn-secondary"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleLoadTemplate}
            disabled={!selectedTemplate}
            className="btn-primary"
            type="button"
            aria-label={selectedTemplate ? `Load ${templates.find(t => t.key === selectedTemplate)?.name} template` : 'Select a template first'}
          >
            Load Template
          </button>
        </div>
      </div>
    </div>
  );
});
