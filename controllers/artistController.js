const Artist = require("../models/artist");
const Album = require("../models/album")
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");

// Display list of all artists.
exports.artist_list = asyncHandler(async (req, res, next) => {
    const allArtists = await Artist.find().sort({ name: 1 }).exec();
    res.render("artist_list", {
        title: "Artist List",
        artist_list: allArtists,
    })
});

// Display detail page for a specific artist.
exports.artist_detail = asyncHandler(async (req, res, next) => {
  const [artist, allAlbumsByArtist] = await Promise.all([
    Artist.findById(req.params.id).exec(),
    Album.find({ artist: req.params.id }, "title description").exec(),
  ]);

  if (artist === null) {
    const err = new Error("Artist not found");
    err.status = 404;
    return next(err);
  }

  res.render("artist_detail", {
    title: "Artist Deatil",
    artist: artist,
    artist_albums: allAlbumsByArtist,
  })
});

// Display artist create form on GET.
exports.artist_create_get = (req, res, next) => {
  res.render("artist_form", { title: "Create Artist" });
}

// Handle artist create on POST.
exports.artist_create_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Artist name must be specified.")
    // .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters"),
  body("date_of_origin", "Invalid date of origin")
    .optional({ values: "truthy" })
    .isISO8601()
    .toDate(),
  body("date_of_breakup", "Invalid date of breakup")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const artist = new Artist({
      name: req.body.name,
      date_of_origin: req.body.date_of_origin,
      date_of_breakup: req.body. date_of_breakup,
    });
    if (!errors.isEmpty()) {
      res.render("artist_form", {
        title: "Create Artist",
        artist: artist,
        errors: errors.array(),
      });
      return;
    } else {
      await artist.save();
      res.redirect(artist.url);
    }
  })
]

// Display artist delete form on GET.
exports.artist_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: artist delete GET");
});

// Handle artist delete on POST.
exports.artist_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: artist delete POST");
});

// Display artist update form on GET.
exports.artist_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: artist update GET");
});

// Handle artist update on POST.
exports.artist_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: artist update POST");
});
