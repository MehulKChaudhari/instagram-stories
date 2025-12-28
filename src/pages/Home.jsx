import { useState } from 'react';
import StoryList from '../components/StoryList';
import StoryViewer from '../components/StoryViewer';
import { stories } from '../data/stories';
import './Home.css';

function Home() {
  const [selectedStoryId, setSelectedStoryId] = useState(null);

  const handleStoryClick = (storyId) => {
    setSelectedStoryId(storyId);
  };

  const handleCloseViewer = () => {
    setSelectedStoryId(null);
  };

  const handleNextStory = () => {
    const currentIndex = stories.findIndex((s) => s.id === selectedStoryId);
    if (currentIndex < stories.length - 1) {
      setSelectedStoryId(stories[currentIndex + 1].id);
    } else {
      handleCloseViewer();
    }
  };

  const handlePreviousStory = () => {
    const currentIndex = stories.findIndex((s) => s.id === selectedStoryId);
    if (currentIndex > 0) {
      setSelectedStoryId(stories[currentIndex - 1].id);
    } else {
      handleCloseViewer();
    }
  };

  return (
    <div className="home-container">
      <div className="app-header">
        <h1>Stories</h1>
      </div>
      <StoryList stories={stories} onStoryClick={handleStoryClick} />
      {selectedStoryId && (
        <StoryViewer
          stories={stories}
          currentStoryId={selectedStoryId}
          onClose={handleCloseViewer}
          onNext={handleNextStory}
          onPrevious={handlePreviousStory}
        />
      )}
    </div>
  );
}

export default Home;

