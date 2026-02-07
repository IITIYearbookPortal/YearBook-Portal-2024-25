import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { ImagePlus, X, Send } from 'lucide-react';
import './AddMemoryForm.css';

function AddMemoryForm({ onSubmit, onCancel }) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 3) {
      alert('You can select at most 3 images');
      return;
    }

    setImages((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('content', content.trim());

    images.forEach((img) => {
      formData.append('images', img);
    });

    await onSubmit(formData);

    setIsSubmitting(false);
    setContent('');
    setImages([]);
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

      <div className="amf-field">
        <Label className="amf-label">
          Add Photos (Max 3)
        </Label>

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

          {images.length < 3 && (
            <label className="amf-add-label">
              <ImagePlus />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
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
