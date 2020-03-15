import React, { useState, useEffect } from 'react';
import userIcon from '../../icon.svg';

const getFormattedDuration = duration => {
  if (Number(duration) > 60 * 60) {
    return `${Math.floor(duration / (60 * 60))} hours ago`;
  } else if (Number(duration) > 60) {
    return `${Math.floor(duration / 60)} minutes ago`;
  } else {
    return `${Math.floor(duration)} seconds ago`;
  }
};

const PostsSection = ({ data, children, clickSubmitReply }) => {
  const [commentFlag, setCommentFlag] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyFlag, setReplyFlag] = useState(false);
  const [replyText, setReplyText] = useState('');

  const { id, comment, userName, createdTime } = data;

  const [duration, setDuration] = useState(0);
  const isMainPost = id.split('-').length === 1;

  const handleSubmitReply = text => {
    let newId;
    if (data.replies.length > 0) {
      newId = `${id}-${data.replies.length + 1}`;
    } else {
      newId = `${id}-1`;
    }
    clickSubmitReply(id, newId, text);
    setReplyFlag(false);
    setCommentFlag(false);
  };

  useEffect(() => {
    setInterval(() => {
      const duration = `${Math.floor(
        (new Date().getTime() - new Date(createdTime).getTime()) / 1000
      )}`;
      setDuration(duration);
    }, 1000);
  }, []);

  return isMainPost ? (
    <div className="postsSection" key={id}>
      <div className="userName">
        <img className="userIcon" src={userIcon} />
        <div>{userName}</div>
      </div>
      <hr />
      <div className="mainPost">{comment}</div>
      <div className="actionCenter">
        <span className="action">Like</span>
        <span className="action" onClick={() => setCommentFlag(!commentFlag)}>
          Comment
        </span>
        <span className="action">Share</span>
        <span className="duration">{getFormattedDuration(duration)}</span>
      </div>
      {commentFlag && (
        <div className="commentSection">
          <input
            className="commentInput"
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
          />
          <button
            className="commentButton"
            onClick={() => handleSubmitReply(commentText)}
          >
            comment
          </button>
        </div>
      )}
      {children}
    </div>
  ) : (
    <div className="commentsSection" key={id}>
      <div className="userName">
        <img className="userIcon" src={userIcon} />
        <div>
          <div>
            <span className="commentUserNameText">{userName}</span>
            <span className="commentPost">{comment}</span>
          </div>
          <div className="commentsActionCenter">
            <span className="action">Like</span>
            <span className="action" onClick={() => setReplyFlag(!replyFlag)}>
              Reply
            </span>
            <span className="duration">{getFormattedDuration(duration)}</span>
          </div>
        </div>
      </div>
      {replyFlag && (
        <div className="replySection">
          <input
            className="replyInput"
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
          />
          <button
            className="replyButton"
            onClick={() => handleSubmitReply(replyText)}
          >
            reply
          </button>
        </div>
      )}
      {children}
    </div>
  );
};

export default PostsSection;
