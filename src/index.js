import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import sampleData from '../sample-data/sample-data';
import CommentBox from './components/CommentBox/CommentBox';
import PostsSection from './components/CommentsSection/CommentsSection';
import './styles.scss';

const setValue = (arr, ids, value) => {
  arr.forEach((item, i) => {
    if (item.id === ids[0] && ids.length > 1) {
      ids.shift();
      return setValue(item.replies, ids, value);
    } else if (ids.length === 1 && item.id === ids[0]) {
      item.replies.push(value);
    }
  });
  return arr;
};

const buildPostSection = (post, replyHandler) => {
  return (
    <React.Fragment key={post.id}>
      <PostsSection data={post} key={post.id} clickSubmitReply={replyHandler}>
        {post.replies.length > 0 &&
          post.replies.map(post => buildPostSection(post, replyHandler))}
      </PostsSection>
    </React.Fragment>
  );
};

class App extends Component {
  componentDidMount() {
    const dataFromLS = JSON.parse(localStorage.getItem('allPosts'));
    if (dataFromLS) {
      this.setState({ data: dataFromLS });
    } else {
      this.setState({ data: sampleData });
      localStorage.setItem('allPosts', JSON.stringify(sampleData));
    }
  }

  state = { data: [] };

  _handleOnPostClick = commentText => {
    const { data } = this.state;
    const newComment = {
      id: String(data.length + 1),
      createdTime: new Date(),
      userName: `Random_User_${Math.random() * 1000}`,
      comment: commentText,
      replies: [],
    };
    this.setState(
      ({ data }) => ({
        data: data.concat(newComment),
      }),
      () => localStorage.setItem('allPosts', JSON.stringify(this.state.data))
    );
  };

  _handleSubmitReply = (id, newId, replyText) => {
    const allPosts = JSON.parse(localStorage.getItem('allPosts'));
    const ids = id.split('-');
    const traversingIds = [];
    for (let i = 0; i < ids.length; i++) {
      traversingIds.push(ids.slice(0, i + 1).join('-'));
    }

    const newReply = {
      id: newId,
      createdTime: `${new Date()}`,
      userName: 'Random User',
      comment: replyText,
      replies: [],
    };

    localStorage.setItem(
      'allPosts',
      JSON.stringify(setValue(allPosts, traversingIds, newReply))
    );
    this.setState({ data: allPosts });
  };

  render() {
    const { data } = this.state;

    return (
      <div className="mainContainer">
        <span className="title">Add a post</span>
        <CommentBox handleOnClick={this._handleOnPostClick} />
        <div className="postsContainer">
          {data.map(post => {
            return buildPostSection(post, this._handleSubmitReply);
          })}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
