const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    title: { type: String, required: true },
    artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
    tracks: { type: Number, required: true },
    release: { type: Number, required: true },
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
});

// Virtual for albums URL
AlbumSchema.virtual('url').get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/album/${this._id}`;
});

// export
module.exports = mongoose.model("Album", AlbumSchema);