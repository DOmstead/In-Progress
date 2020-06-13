TRUNCATE notes, folders RESTART IDENTITY CASCADE;

INSERT INTO folders (name)
VALUES
  ('ToDoList'),
  ('Projects'),
  ('Special'),
  ('WishList');

INSERT INTO notes (name, content, folder_id)
VALUES
  ('Really Cool Stuff', 'This is about cool stuff!', 1),
  ('New Programs', 'Stuff that we should design', 4);
