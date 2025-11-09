export const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return "Email is required";
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(email.trim())) {
    return "Invalid email format";
  }

  return null;
};

export const getInitials  = (title) => {
  if (!title) return "";

  const words = title.split(" ");
  let initials = "";

  for (let i  = 0; i < Math.min(words.length, 2); i++){
    initials += words[i][0]
  }
  return initials.toUpperCase();
}
