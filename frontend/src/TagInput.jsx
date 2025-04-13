import { React, useState, useRef, useEffect } from 'react';

function TagInput({ tags, push, remove }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddTag = () => {
    const trimmed = newTag.trim();

    if (trimmed !== '') {
        push(trimmed);
    }
    
    setNewTag('');
    setIsAdding(false);
  };

  const handleKeydown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTag();
    } else if (e.key === 'Escape') {
        setNewTag('');
        setIsAdding(false);
    }
  }

  const handleBlur = () => {
    if (newTag.trim()) {
      handleAddTag();
    } else {
      setIsAdding(false);
    }
  };

  return (
    <div className="tag-container">
      {tags.map((tag, idx) => (
        <div key={idx} className="tag">
          {tag}
          <button
            type="button"
            onClick={() => remove(idx)}
            className="remove-tag"
            title="Remove tag"
          >
            ×
          </button>
        </div>
      ))}

      {isAdding ? (
        <input
          ref={inputRef}
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeydown}
          className="tag-input"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="plus-button"
          title="Add tag"
        >
          +
        </button>
      )}
    </div>
  );
}

export default TagInput;