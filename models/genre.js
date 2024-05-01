const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
});

// Virtual for genres URL
GenreSchema.virtual('url').get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/genre/${this._id}`;
});

// export
module.exports = mongoose.model("Genre", GenreSchema);