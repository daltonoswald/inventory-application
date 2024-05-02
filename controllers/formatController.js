const Format = require("../models/format");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
});

// Display list of all formats.
exports.format_list = asyncHandler(async (req, res, next) => {
    const allFormats = await Format.find({}, "name")
    .sort({ name: 1 })
    .populate("name")
    .exec();

    res.render("format_list", { title: "format List", format_list: allFormats });
});

// Display detail page for a specific format.
exports.format_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: format detail: ${req.params.id}`);
});

// Display format create form on GET.
exports.format_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: format create GET");
});

// Handle format create on POST.
exports.format_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: format create POST");
});

// Display format delete form on GET.
exports.format_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: format delete GET");
});

// Handle format delete on POST.
exports.format_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: format delete POST");
});

// Display format update form on GET.
exports.format_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: format update GET");
});

// Handle format update on POST.
exports.format_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: format update POST");
});
