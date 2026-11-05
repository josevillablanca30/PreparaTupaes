-- Expand only the public cosmetic avatar catalogue. Preserve all existing IDs and privacy policies.
ALTER TABLE cachaste.profiles DROP CONSTRAINT profiles_avatar_check;
ALTER TABLE cachaste.profiles ADD CONSTRAINT profiles_avatar_check CHECK (avatar BETWEEN 0 AND 23);
