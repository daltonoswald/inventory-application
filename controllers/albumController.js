const Album = require("../models/album");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require('express-validator');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function ( req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of albums, artists and genre counts (in parallel)
  const [
    numAlbums,
    // numBookInstances,
    // numAvailableBookInstances,
    numArtists,
    numGenres,
  ] = await Promise.all([
    Album.countDocuments({}).exec(),
    // BookInstance.countDocuments({}).exec(),
    // BookInstance.countDocuments({ status: "Available" }).exec(),
    Artist.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "All Things Vinyl Records",
    album_count: numAlbums,
    // book_instance_count: numBookInstances,
    // book_instance_available_count: numAvailableBookInstances,
    artist_count: numArtists,
    genre_count: numGenres,
  });
});


// Display list of all albums.
exports.album_list = asyncHandler(async (req, res, next) => {
    const allAlbums = await Album.find({}, "title artist release")
    .sort({ title: 1 })
    .populate("artist")
    .exec();

    res.render("album_list", { title: "Album List", album_list: allAlbums });
});

// Display detail page for a specific album.
exports.album_detail = asyncHandler(async (req, res, next) => {
  const album = await Album.findById(req.params.id)
  .populate("artist")
  .populate("genre")
  .exec();
  
  if (album === null) {
    const err = new Error("Album not found");
    err.status = 404;
    return next(err);
  }

  res.render("album_detail", {
    title: album.title,
    album: album,
  })
});

// Display album create form on GET.
exports.album_create_get = asyncHandler(async (req, res, next) => {
  const [allArtists, allGenres] = await Promise.all([
    Artist.find().sort({ name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  res.render("album_form", {
    title: "Create Album",
    artists: allArtists,
    genres: allGenres,
  })
});

// Handle album create on POST.
exports.album_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },
  upload.single("image"),
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("artist", "Artist must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("tracks", "Tracks must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("release", "Release Year must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*", "Genre must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Stock must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const album = new Album({
      title: req.body.title,
      artist: req.body.artist,
      tracks: req.body.tracks,
      release: req.body.release,
      genre: req.body.genre,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      image: req.file ? req.file.filename : null,
    });

    if (!errors.isEmpty()) {
      const [allArtists, allGenres] = await Promise.all([
        Artist.find().sort({ name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      for (const genre of allGenres) {
        if (album.genre.includes(genre._id)) {
          genre.checked = 'true';
        }
      }
      res.render("album_form", {
        title: "Create Album",
        artists: allArtists,
        genres: allGenres,
        album: album,
        errors: errors.array(),
      });
    } else {
      await album.save();
      res.redirect(album.url);
    }
  })
]

// Display album delete form on GET.
exports.album_delete_get = asyncHandler(async (req, res, next) => {

  const album = await Album.findById(req.params.id).populate('artist').populate('genre').exec();

  if (album === null) {
    res.redirect("/catalog/albums");
  }

  res.render("album_delete", {
    title: "Delete album",
    album: album,
  })
});

// Handle album delete on POST.
exports.album_delete_post = asyncHandler(async (req, res, next) => {
  const album = await Album.findById(req.params.id).populate("artist").populate("genre").exec()

  if (album === null) {
    res.render('album_delete', {
      title: "Delete Album",
      album: album,
    });
  } else {
    await Album.findByIdAndDelete(req.body.albumid);
    res.redirect("/catalog/albums");
  }
});

// Display album update form on GET.
exports.album_update_get = asyncHandler(async (req, res, next) => {
  const [album, allArtists, allGenres] = await Promise.all([
    Album.findById(req.params.id).populate("artist").exec(),
    Artist.find().sort({ name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);

  if (album === null) {
    const err = new Error("Album not found");
    err.status = 404;
    return next(err);
  }

  allGenres.forEach((genre) => {
    if (album.genre.includes(genre._id)) genre.checked = 'true';
  });

  res.render('album_form', {
    title: "Update Album",
    artists: allArtists,
    genres: allGenres,
    album: album,
  })
});

// Handle album update on POST.
exports.album_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("artist", "Artist must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("tracks", "Tracks must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("release", "Release Year must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*", "Genre must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("stock", "Stock must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const album = new Album({
      title: req.body.title,
      artist: req.body.artist,
      tracks: req.body.tracks,
      release: req.body.release,
      genre: req.body.genre,
      price: req.body.price,
      stock: req.body.stock,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const [allArtists, allGenres] = await Promise.all([
        Artist.find().sort({ name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      for (const genre of allGenres) {
        if (album.genre.indexOf(genre._id) > -1) {
          genre.checked = 'true';
        }
      }
      res.render('album_form', {
        title: "Update Album",
        artists: allArtists,
        genres: allGenres,
        album: album,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedAlbum = await Album.findByIdAndUpdate(req.params.id, album, {});
      res.redirect(updatedAlbum.url);
    }
  })
]