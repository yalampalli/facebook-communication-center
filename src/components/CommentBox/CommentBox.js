import React, { useState } from 'react';
import './CommentBox.scss';

const CommentBox = props => {
  const { handleOnClick } = props;
  const [text, setText] = useState('');

  const handleOnSubmitClick = () => {
    handleOnClick(text);
    setText('');
  };

  return (
    <div className="commentBoxMain">
      <textarea
        value={text}
        type="text"
        className="postInput"
        onChange={e => setText(e.target.value)}
      />
      <button className="postButton" onClick={() => handleOnSubmitClick()}>
        Submit
      </button>
    </div>
  );
};

export default CommentBox;
