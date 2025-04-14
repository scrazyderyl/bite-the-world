import React, { useState } from "react";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./ImageSelector.css";

export default function ImageSelector({ images = [], push, remove, insert }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showInputBox, setShowInputBox] = useState(false);
  const [imageURL, setImageURL] = useState();

  const isValidImageURL = (input) => {
    var url;
    
    try {
      url = new URL(input);
    } catch (e) {
      return false;
    }

    // Check extension
    var lastDotIndex = url.pathname.lastIndexOf(".");

    if (lastDotIndex == -1) {
      return false;
    }

    var extension = url.pathname.slice(lastDotIndex + 1);

    if (extension == "png" || extension == "jpg" || extension == "jpeg" || extension == "gif" || extension == "webp") {
      return url.protocol == "http:" || url.protocol == "https:";
    }

    return false;
  }

  const handleAdd = () => {
    if (isValidImageURL(imageURL)) {
      insert(0, imageURL);
      setImageURL("");
      setShowInputBox(false);
    } else {
      toast.error("Invalid image URL");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Escape") {
      setShowInputBox(false);
      setImageURL("");
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const srcIdx = result.source.index;
    const destIdx = result.destination.index;

    if (srcIdx === destIdx) return;

    const movedImage = images[srcIdx];
    remove(srcIdx);
    insert(destIdx, movedImage);
  };

  return (
    <>
      {/* Main preview */}
        <div className="main-preview">
          {images.length > 0 ? (
          <img
            src={images[selectedIndex]}
            alt="Main preview"
            className="main-image"
            />
          ) : (
            <span>No image selected</span>
          )}
        </div>

      {/* Thumbnails */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="thumbnail-row">
          {/* Add Image Placeholder */}
          {showInputBox ? (
            <div className="add-box same-size">
              <input
                type="text"
                className="url-input"
                value={imageURL}
                placeholder="Image URL"
                onChange={(e) => setImageURL(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <div className="add-controls">
                <button type="button" className="confirm-button" onClick={handleAdd}>
                  Add
                </button>
                <button type="button" className="cancel-button"
                  onClick={() => {
                    setShowInputBox(false);
                    setImageURL("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="thumbnail-placeholder same-size" onClick={() => setShowInputBox(true)}>
              +
            </div>
          )}
          <Droppable droppableId="image-thumbs" direction="horizontal">
            {(provided) => (
              <div
                className="draggable-thumbnails"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {images.map((url, index) => (
                  <Draggable key={url + index} draggableId={url + index} index={index}>
                    {(provided) => (
                      <div
                        className="thumbnail-wrapper"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => setSelectedIndex(index)}
                      >
                        <img
                          src={url}
                          alt={`Thumbnail ${index}`}
                          className="thumbnail-image"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="remove-image"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </>
  );
}
