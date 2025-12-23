// AddMemoryForm.jsx
import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ImagePlus, X, Send } from 'lucide-react';
import './AddMemoryForm.css';

function AddMemoryForm({ onSubmit, onCancel, locationName, seniorName }) {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !authorName.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    onSubmit({
      content: content.trim(),
      authorName: authorName.trim(),
      images: images.length > 0 ? images : undefined,
    });

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="amf-space-y-5">
      <div className="amf-notice">
        <p className="amf-notice-text">
          Share a memory about{' '}
          <span className="amf-strong">{seniorName || 'this senior'}</span>
          {' '}at{' '}
          <span className="amf-strong">{locationName}</span>
        </p>
      </div>

      <div className="amf-field">
        <Label htmlFor="authorName" className="amf-label">
          Your Name
        </Label>
        <Input
          id="authorName"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Enter your name"
          className="amf-input"
          required
        />
      </div>

      <div className="amf-field">
        <Label htmlFor="content" className="amf-label">
          Your Memory
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your favorite memory at this location..."
          className="amf-textarea"
          required
        />
        <p className="amf-char-count">{content.length}/500 characters</p>
      </div>

      {/* Image upload */}
      <div className="amf-field">
        <Label className="amf-label">Add Photos (Optional)</Label>
        <div className="amf-images-wrap">
          {images.map((img, index) => (
            <div key={index} className="amf-image-item">
              <div className="amf-image-box">
                <img src={img} alt="preview" className="amf-image" />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="amf-remove-btn"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="amf-remove-icon" />
              </button>
            </div>
          ))}

          {images.length < 4 && (
            <label className="amf-add-label">
              <ImagePlus className="amf-add-icon" />
              <span className="amf-add-text">Add</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="amf-file-input"
              />
            </label>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="amf-actions">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="amf-btn amf-btn-outline"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="amf-btn amf-btn-primary"
          disabled={!content.trim() || !authorName.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <span className="amf-saving">
              <span className="amf-spinner" />
              Saving...
            </span>
          ) : (
            <span className="amf-submit-content">
              <Send className="amf-send-icon" />
              Share Memory
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}

export default AddMemoryForm;

