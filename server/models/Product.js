import mongoose from 'mongoose';

const performanceStatsSchema = new mongoose.Schema({
    power:   { type: String, default: '' },
    speed:   { type: String, default: '' },
    control: { type: String, default: '' },
}, { _id: false });

const productSchema = new mongoose.Schema({
    name:    { type: String, required: true, trim: true },
    price:   { type: Number, required: true },
    series:  { type: String, default: '' },
    status:  { type: String, required: true, enum: ['racket', 'shoes', 'shuttle'] },
    img:     { type: String, default: '' },
    thumbnails: { type: [String], default: [] },

    // Racket-specific
    sku:        { type: String, default: '' },
    SKU:        { type: String, default: '' },
    'w/s':      { type: String, default: '' },
    lbs:        { type: String, default: '' },
    fm:         { type: String, default: '' },
    sm:         { type: String, default: '' },
    balance:    { type: String, default: '' },
    stiff:      { type: String, default: '' },
    performanceStats: { type: performanceStatsSchema, default: () => ({}) },

    // Shoes-specific
    colors:   { type: [String], default: [] },
    outsole:  { type: String, default: '' },
    midsole:  { type: String, default: '' },
    upper:    { type: String, default: '' },
    size:     { type: String, default: '' },

    // Shuttle-specific
    type:         { type: String, default: '' },
    headMaterial: { type: String, default: '' },
    speed:        { type: String, default: '' },
    unit:         { type: String, default: '' },

    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    strict: false, // cho phép lưu extra fields từ data gốc
});

// Index để search nhanh
productSchema.index({ status: 1 });
productSchema.index({ name: 'text', series: 'text' });

export default mongoose.model('Product', productSchema);
