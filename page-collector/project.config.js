const projects = {
  moda: [
    { page_collection: true },
   // { page_data_collection: true },
    { page_data_export: false },
    { page_data_upload: false },
    { page_image_collection: true },
    { page_image_crop: true },
    { page_image_blur: true },
    { page_image_embed: true },
    { page_nav_data_tree_creation: true },
    { page_leaves_creation: true },
    { page_generation: true },
    { page_component_attacher: true },
    { page_script_attacher: true },
    { page_nav_items: true },
    { page_builder: true }],
//https://books.toscrape.com/
  books: [
    { page_collection: true },
    //{ page_data_upload: true },
    //{ page_data_collection: true },
    { page_image_collection: false },
  //  { page_image_upload: true },
  //  { page_data_upload: true },
    { page_image_crop: false },
    { page_image_blur: false },
    { page_image_embed: false },
    { page_nav_data_tree_creation: false },
    { page_leaves_creation: false },
    { page_generation: false },
    { page_component_attacher: false },
    { page_script_attacher: false },
    { page_nav_items: false },
    { page_builder: false }],
    companyinfo: [
      { page_collection: true },
      //{ page_data_upload: true },
      //{ page_data_collection: true },
      { page_image_collection: false },
    //  { page_image_upload: true },
    //  { page_data_upload: true },
      { page_image_crop: false },
      { page_image_blur: false },
      { page_image_embed: false },
      { page_nav_data_tree_creation: false },
      { page_leaves_creation: false },
      { page_generation: false },
      { page_component_attacher: false },
      { page_script_attacher: false },
      { page_nav_items: false },
      { page_builder: false }]

};

module.exports = {
  projects
};
