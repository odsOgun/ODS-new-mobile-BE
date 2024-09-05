import bcrypt from 'bcryptjs';

export const passwordHash = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data, salt);
  return hash;
};

export const passwordCompare = async (password, hash) => {
  const isMatchPassword = await bcrypt.compare(password, hash);
  return isMatchPassword;
};
