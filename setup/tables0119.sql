ALTER TABLE manager.photo ADD COLUMN name text;
UPDATE manager.photo SET name = photo_url;
