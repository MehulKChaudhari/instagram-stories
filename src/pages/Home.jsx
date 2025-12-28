import { useState, useRef } from 'react';
import StoryList from '../components/StoryList';
import StoryViewer from '../components/StoryViewer';
import { users } from '../data/stories';
import './Home.css';

function Home() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [isUserTransition, setIsUserTransition] = useState(false);
  const hasOpenedRef = useRef(false);

  const handleStoryClick = (userId, storyId) => {
    setIsUserTransition(false);
    hasOpenedRef.current = false;
    setSelectedUserId(userId);
    setSelectedStoryId(storyId);
  };

  const handleCloseViewer = () => {
    setSelectedUserId(null);
    setSelectedStoryId(null);
  };

  const getCurrentUser = () => {
    return users.find((u) => u.id === selectedUserId);
  };

  const getCurrentUserIndex = () => {
    return users.findIndex((u) => u.id === selectedUserId);
  };

  const handleNextStory = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const currentStoryIndex = currentUser.stories.findIndex((s) => s.id === selectedStoryId);
    
    if (currentStoryIndex < currentUser.stories.length - 1) {
      setSelectedStoryId(currentUser.stories[currentStoryIndex + 1].id);
    } else {
      const currentUserIndex = getCurrentUserIndex();
      if (currentUserIndex < users.length - 1) {
        const nextUser = users[currentUserIndex + 1];
        setIsUserTransition(true);
        setSelectedUserId(nextUser.id);
        setSelectedStoryId(nextUser.stories[0].id);
      } else {
        handleCloseViewer();
      }
    }
  };

  const handlePreviousStory = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const currentStoryIndex = currentUser.stories.findIndex((s) => s.id === selectedStoryId);
    
    if (currentStoryIndex > 0) {
      setSelectedStoryId(currentUser.stories[currentStoryIndex - 1].id);
    } else {
      const currentUserIndex = getCurrentUserIndex();
      if (currentUserIndex > 0) {
        const prevUser = users[currentUserIndex - 1];
        setIsUserTransition(true);
        setSelectedUserId(prevUser.id);
        setSelectedStoryId(prevUser.stories[prevUser.stories.length - 1].id);
      } else {
        handleCloseViewer();
      }
    }
  };

  const handleNextUser = () => {
    const currentUserIndex = getCurrentUserIndex();
    if (currentUserIndex < users.length - 1) {
      const nextUser = users[currentUserIndex + 1];
      setIsUserTransition(true);
      setSelectedUserId(nextUser.id);
      setSelectedStoryId(nextUser.stories[0].id);
    }
  };

  const handlePreviousUser = () => {
    const currentUserIndex = getCurrentUserIndex();
    if (currentUserIndex > 0) {
      const prevUser = users[currentUserIndex - 1];
      setIsUserTransition(true);
      setSelectedUserId(prevUser.id);
      setSelectedStoryId(prevUser.stories[0].id);
    }
  };

  const currentUser = getCurrentUser();

  return (
    <div className="home-container">
      <div className="app-header">
        <h1>Stories</h1>
      </div>
      <StoryList users={users} onStoryClick={handleStoryClick} />
      {selectedUserId && selectedStoryId && currentUser && (
        <StoryViewer
          key="story-viewer"
          user={currentUser}
          stories={currentUser.stories}
          currentStoryId={selectedStoryId}
          isUserTransition={isUserTransition}
          hasOpenedBefore={hasOpenedRef.current}
          onClose={handleCloseViewer}
          onNext={handleNextStory}
          onPrevious={handlePreviousStory}
          onNextUser={handleNextUser}
          onPreviousUser={handlePreviousUser}
          onUserTransitionComplete={() => {
            setIsUserTransition(false);
            hasOpenedRef.current = true;
          }}
          onFirstOpen={() => {
            hasOpenedRef.current = true;
          }}
        />
      )}
    </div>
  );
}

export default Home;

