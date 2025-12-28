import './StoryList.css';

function StoryList({ users, onStoryClick }) {
  return (
    <div className="story-list-container">
      <div className="story-list">
        {users.map((user) => (
          <div
            key={user.id}
            className="story-item"
            onClick={() => onStoryClick(user.id, user.stories[0].id)}
          >
            <div className="story-thumbnail-wrapper">
              <img
                src={user.stories[0].imageUrl}
                alt={`${user.username} story`}
                className="story-thumbnail"
              />
            </div>
            <div className="story-user-avatar">
              <img src={user.avatar} alt={user.username} />
            </div>
            <span className="story-username">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoryList;

