CREATE EXTENSION hstore;
CREATE SCHEMA manager;
CREATE TABLE manager.user (
  id serial primary key,
  username text,
  password text
);
CREATE TABLE manager.project (
  id serial primary key,
  user_id integer references manager.user(id) ON DELETE CASCADE,
  title text,
  description text,
  schema hstore
);
CREATE TABLE manager.photo (
  id serial primary key,
  project_id integer references manager.project(id) ON DELETE CASCADE,
  photo_url text
);
CREATE TABLE manager.data (
  id serial primary key,
  photo_id integer references manager.photo(id) ON DELETE CASCADE,
  project_id integer references manager.project(id) ON DELETE CASCADE,
  row hstore
);
