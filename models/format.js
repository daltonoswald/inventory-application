const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FormatSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
});

// Virtual for Formats URL
FormatSchema.virtual('url').get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/format/${this._id}`;
});


// export
module.exports = mongoose.model("Format", FormatSchema);