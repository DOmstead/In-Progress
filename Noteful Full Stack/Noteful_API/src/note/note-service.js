//This section is one of two sections that handle the heavy lifting of the server. Once a request has been made,
//and after it has been appropriately routed by the router, these function are then called
//to make the desired updates.

const NoteService = {
  //This function returns all name records present in our database.
  getAllNotes(knex) {
    return knex
      .select('*')
      .from('notes')
      .orderBy('id', 'asc');
  },
  //This function is used to add additional records to our database. 
  insertNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into('notes')
      .returning('*')
      .then(rows => rows[0]);
  },
  //This function allows us to obtain a specific record using the ID.
  getById(knex, id) {
    return knex
      .from('notes')
      .select('*')
      .where('id', id)
      .first();
  },
  //This function allows a record, as identified by ID, to be removed from our database. 
  deleteNote(knex, id) {
    return knex('notes')
      .where({ id })
      .delete();
  },
  //This function allows a record to be updated when called during a patch request. 
  updateNote(knex, id, newNoteFields) {
    return knex('notes')
      .where({ id })
      .update(newNoteFields);
  }
};

module.exports = NoteService;
