//This section is one of two sections that handle the heavy lifting of the server. Once a request has been made,
//and after it has been appropriately routed by the router, these function are then called
//to make the desired updates.

const FolderService = {

  //This function returns all name records present in our database.
  getAllFolders(knex) {
    return knex
      .select('*')
      .from('folders')
      .orderBy('id', 'asc');
  },
  //This function is used to add additional records to our database.   
  insertFolder(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into('folders')
      .returning('*')
      .then(rows => rows[0]);
  },
  //This function allows us to obtain a specific record using the ID.  
  getById(knex, id) {
    return knex
      .from('folders')
      .select('*')
      .where('id', id)
      .first();
  },
  //This function allows a record, as identified by ID, to be removed from our database.   
  deleteFolder(knex, id) {
    return knex('folders')
      .where({ id })
      .delete();
  },
  //This function allows a record to be updated when called during a patch request. 
  updateFolder(knex, id, newFolderFields) {
    return knex('folders')
      .where({ id })
      .update(newFolderFields);
  }
};

module.exports = FolderService;
