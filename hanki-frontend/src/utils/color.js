export const getProgressColor = (progress) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 60) return "bg-yellow-500";
  return "bg-red-500";
};
