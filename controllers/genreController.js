const Genre = require("../models/genre");
const Album = require('../models/album')
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require('express-validator');

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find({}, "name")
    .sort({ name: 1 })
    .populate("name")
    .exec();

    res.render("genre_list", { title: "Genre List", genre_list: allGenres });
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, albumsInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Album.find({ genre: req.params.id }, "title artist description").populate("artist").exec(),
  ]);
  if (genre === null) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_details", {
    title: "Genre Detail",
    genre: genre,
    genre_albums: albumsInGenre,
  })
});

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre "});
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name", "Genre name must contain at least 3 characters")
  .trim()
  .isLength({ min: 3 })
  .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      const genreExists = await Genre.findOne({ name: req.body.name }).exec();
      if (genreExists) {
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        res.redirect(genre.url);
      }
    }
  }),
]

//Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [ genre, allAlbumsWithGenre] = await Promise.all([
      Genre.findById(req.params.id).exec(),
      Album.find({ genre: req.params.id }).exec(),
  ]);

  if (genre === null) {
      // No results
      res.redirect('/catalog/genres');
  }

  res.render('genre_delete', {
      title: "Delete Genre",
      genre: genre,
      genre_albums: allAlbumsWithGenre,
  })
})

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [ genre, allAlbumsWithGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Album.find({ genre: req.params.id }).exec(),
]);

  if (allAlbumsWithGenre.length > 0) {
    res.render('genre_delete', {
      title: "Delete Genre",
      genre: genre,
      genre_albums: allAlbumsWithGenre,
  })
    return;
  } else {
    await Genre.findByIdAndDelete(req.body.id);
    res.redirect("/catalog/Genres");
  }
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();

  if (genre === null) {
    // No results.
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("genre_form", { title: "Update Genre", genre: genre });
});

// Handle Genre update on POST.
exports.genre_update_post = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Update Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Genre.findByIdAndUpdate(req.params.id, genre);
      res.redirect(genre.url);
    }
  }),
];