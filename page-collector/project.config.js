const projects = {
  moda: [
    { page_collection: true },
    // { page_data_collection: true },
    { page_merge_files: true },
    { page_export_excel: true },
    { page_upload_excel: false },
    { page_data_upload: false },
    { page_image_collection: false },
    { page_image_upload: false },
    { page_image_crop: false },
    { page_image_blur: false },
    { page_image_embed: false },
    { page_nav_data_tree_creation: false },
    { page_leaves_creation: false },
    { page_generation: false },
    // { page_component_attacher: true },
    //{ page_script_attacher: true },
    { page_nav_items: false },
    { page_builder: false },
    { page_prerender: false }

  ],
  //https://books.toscrape.com/
  books: [
    { page_collection: true },
    { page_merge_files: true },
    { page_export_excel: true },
    { page_upload_excel: false },
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
