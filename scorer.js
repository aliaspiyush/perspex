export const calculateScore = (semantic, behavioral, experience, preference) => {
    const weights = {
      semantic: 0.40,
      behavioral: 0.30,
      experience: 0.20,
      preference: 0.10,
    };
  
    return weights.semantic * semantic + weights.behavioral * behavioral + weights.experience * experience + weights.preference * preference;
  };