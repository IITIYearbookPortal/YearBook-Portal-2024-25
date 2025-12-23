import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { ImagePlus, X, Send } from 'lucide-react';
import './AddMemoryForm.css';

function AddMemoryForm({ onSubmit, onCancel }) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit({ content: content.trim() });
  };
  return (
    <form onSubmit={handleSubmit} className="amf-space-y-5">
      <div className="amf-field">
        <Label htmlFor="content" className="amf-label">
          Your Memory
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your favorite memory..."
          className="amf-textarea"
          required
        />
        <p className="amf-char-count">{content.length}/500 characters</p>
      </div>

      {/* Image upload (UI only for now) */}
      <div className="amf-field">
        <Label className="amf-label">Add Photos (Optional)</Label>
        <div className="amf-images-wrap">
          {images.map((file, index) => (
            <div key={index} className="amf-image-item">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="amf-image"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="amf-remove-btn"
              >
                <X />
              </button>
            </div>
          ))}

          {images.length < 4 && (
            <label className="amf-add-label amf-disabled">
              <ImagePlus />
              <input
                type="file"
                accept="image/*"
                multiple
                disabled
                hidden
              />
            </label>
          )}
        </div>
      </div>

      <div className="amf-actions">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (
            <>
              <Send /> Share Memory
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default AddMemoryForm;