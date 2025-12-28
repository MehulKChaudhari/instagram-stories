import './StoryList.css';

function StoryList({ stories, onStoryClick }) {
  return (
    <div className="story-list-container">
      <div className="story-list">
        {stories.map((story) => (
          <div
            key={story.id}
            className="story-item"
            onClick={() => onStoryClick(story.id)}
          >
            <img
              src={story.imageUrl}
              alt={`Story ${story.id}`}
              className="story-thumbnail"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoryList;

