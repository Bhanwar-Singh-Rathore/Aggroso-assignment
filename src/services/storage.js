export const getHistory = () => {
  try {
    const history = localStorage.getItem("meeting_tracker_history");
    return history ? JSON.parse(history) : [];
  } catch (error) {
    return [];
  }
};

export const getMeetingById = (id) => {
  const history = getHistory();
  return history.find((m) => m.id === parseInt(id));
};

export const saveHistory = (meetingData) => {
  try {
    const history = getHistory();
    const updatedHistory = [meetingData, ...history].slice(0, 10);
    localStorage.setItem(
      "meeting_tracker_history",
      JSON.stringify(updatedHistory),
    );
    return updatedHistory;
  } catch (error) {
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem("meeting_tracker_history");
};
