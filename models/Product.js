const mongoose = require('mongoose');
const slugify = require('slugify');

const specificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: [true, 'Description is required'] },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    discountPrice: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, required: [true, 'Brand is required'], trim: true },
    images: [{ type: String }],
    stock: { type: Number, required: [true, 'Stock is required'], min: 0, default: 0 },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    specifications: [specificationSchema],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

productSchema.pre('save', function () {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  if (this.discountPercentage > 0) {
    this.discountPrice = parseFloat(
      (this.price - (this.price * this.discountPercentage) / 100).toFixed(2)
    );
  } else {
    this.discountPrice = this.price;
  }
});

module.exports = mongoose.model('Product', productSchema);
