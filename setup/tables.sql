CREATE EXTENSION hstore;
CREATE SCHEMA manager;
CREATE TABLE manager.user (
  id serial primary key,
  username text unique,
  password text,
  salt text,
  role text
);
CREATE TABLE manager.project (
  id serial primary key,
  user_id integer references manager.user(id) ON DELETE CASCADE,
  title text,
  description text,
  schema text[]
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
  row text[]
);
CREATE TABLE manager.user_project (
  user_id integer references manager.user(id) ON DELETE CASCADE,
  project_id integer references manager.project(id) ON DELETE CASCADE
);
CREATE TABLE manager.user_data (
  user_id integer references manager.user(id) ON DELETE CASCADE,
  data_id integer references manager.data(id) ON DELETE CASCADE
);
CREATE TABLE manager.user_photo (
  user_id integer references manager.user(id) ON DELETE CASCADE,
  photo_id integer references manager.photo(id) ON DELETE CASCADE
);
