class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.search
      ? {
          $or: [
            { name: { $regex: this.queryString.search, $options: 'i' } },
            { description: { $regex: this.queryString.search, $options: 'i' } },
            { brand: { $regex: this.queryString.search, $options: 'i' } },
          ],
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'search', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Category filter
    if (queryObj.category) {
      this.query = this.query.find({ category: queryObj.category });
      delete queryObj.category;
    }

    // Price filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const parsed = JSON.parse(queryStr);

    if (parsed.price) {
      this.query = this.query.find({ discountPrice: parsed.price });
    }

    // Rating filter
    if (parsed.rating) {
      this.query = this.query.find({ ratings: { $gte: Number(parsed.rating) } });
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate(defaultLimit = 12) {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || defaultLimit;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }
}

module.exports = ApiFeatures;
