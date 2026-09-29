class ImageManager {
  constructor() {
    this.usedUrls = new Set();
    this.dynamicCounters = {};
    
    // Massive pool of Cloudinary images
    this.cloudinaryImages = {
      wedding: [
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606993/photohub/images/wedding/indian-wedding-hero.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606994/photohub/images/wedding/wedding-1.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606995/photohub/images/wedding/wedding-2.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606996/photohub/images/wedding/wedding-3.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606997/photohub/images/wedding/wedding-4.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606998/photohub/images/wedding/wedding-5.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607019/photohub/assets/categories/wedding.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609310/photohub/images/extra/wedding-1511285560929-80b456fea0bc.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609312/photohub/images/extra/wedding-1515934751635-c81c6bc9a2d8.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609313/photohub/images/extra/wedding-1519741497674-611481863552.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609314/photohub/images/extra/wedding-1582510003544-4d00b7f74220.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609316/photohub/images/extra/wedding-1604902396830-aca29e19b067.jpg'
      ],
      fashion: [
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606965/photohub/images/fashion/fashion-1.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606966/photohub/images/fashion/fashion-2.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606968/photohub/images/fashion/fashion-3.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607009/photohub/assets/categories/fashion.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609264/photohub/images/extra/fashion-1469334031218-e382a71b716b.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609265/photohub/images/extra/fashion-1483985988355-763728e1935b.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609266/photohub/images/extra/fashion-1515886657613-9f3515b0c78f.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609268/photohub/images/extra/fashion-1529626455594-4ff0802cfb7e.jpg'
      ],
      corporate: [
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606950/photohub/images/corporate/corporate-1.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606953/photohub/images/corporate/corporate-4.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607001/photohub/assets/categories/corporate.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609244/photohub/images/extra/corporate-1515169067868-5387ec356754.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609245/photohub/images/extra/corporate-1552664730-d307ca884978.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609248/photohub/images/extra/corporate-1556761175-4b46a572b786.jpg'
      ],
      event: [
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606957/photohub/images/event/event-1.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606958/photohub/images/event/event-2.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609255/photohub/images/extra/event-1492691527719-9d1e07e534b4.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609257/photohub/images/extra/event-1511578314322-379afb476865.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609259/photohub/images/extra/event-1514320291840-2e0a9bf2a9ae.jpg'
      ],
      food: [
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606969/photohub/images/food/food-1.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606971/photohub/images/food/food-2.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607012/photohub/assets/categories/food.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609270/photohub/images/extra/food-1512621776951-a57141f2eefd.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609272/photohub/images/extra/food-1551218808-94e220e084d2.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609273/photohub/images/extra/food-1565557623262-b51c2513a641.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609275/photohub/images/extra/food-1589302168068-964664d93dc0.jpg'
      ],
      real_estate: [
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607016/photohub/assets/categories/real_estate.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609305/photohub/images/extra/real_estate-1512917774080-9991f1c4c750.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609306/photohub/images/extra/real_estate-1600596542815-ffad4c1539a9.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609308/photohub/images/extra/real_estate-1600607686527-6fb886090705.jpg'
      ],
      drone: [
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606954/photohub/images/drone/drone-1.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606955/photohub/images/drone/drone-2.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607003/photohub/assets/categories/drone.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609249/photohub/images/extra/drone-1473951574080-01fe45ec8643.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609251/photohub/images/extra/drone-1504109586057-7a2ae83d1338.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609252/photohub/images/extra/drone-1508614589041-895b88991e3e.jpg'
      ],
      portrait: [
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609281/photohub/images/extra/portrait-1494790108377-be9c29b29330.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609284/photohub/images/extra/portrait-1500622944204-b135684e99fd.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609288/photohub/images/extra/portrait-1506794778202-cad84cf45f1d.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609290/photohub/images/extra/portrait-1507003211169-0a1dd7228f2d.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609292/photohub/images/extra/portrait-1520854221256-17451cc331bf.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609294/photohub/images/extra/portrait-1521119989659-a83eee488004.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609297/photohub/images/extra/portrait-1531746020798-e6953c6e8e04.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609299/photohub/images/extra/portrait-1534528741775-53994a69daeb.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609303/photohub/images/extra/portrait-1544005313-94ddf0286df2.jpg'
      ],
      family: [
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606962/photohub/images/family/family-1.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606963/photohub/images/family/family-2.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607007/photohub/assets/categories/family.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609261/photohub/images/extra/family-1511895426328-dc8714191300.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609262/photohub/images/extra/family-1531983412531-1f49a365ffed.jpg'
      ],
      monument: [
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609277/photohub/images/extra/monument-1529253355930-ddbe423a2ac7.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609279/photohub/images/extra/monument-1582510003544-4d00b7f74220.jpg'
      ],
      equipment: [
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785609254/photohub/images/extra/equipment-1510127034890-ba27508e9f1c.jpg'
      ],
      general: [
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606959/photohub/images/faces/faces-1.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606960/photohub/images/faces/faces-2.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606973/photohub/images/hero/hero-3.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606974/photohub/images/locations/locations-1.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606976/photohub/images/locations/locations-3.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785606978/photohub/images/studio-hero.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607014/photohub/assets/categories/product.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607021/photohub/assets/indian/1.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607025/photohub/assets/indian/2.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607027/photohub/assets/indian/3.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607031/photohub/assets/indian/4.jpg',
        'https://res.cloudinary.com/wcxgdspz/image/upload/v1785607034/photohub/assets/indian/5.jpg'
      ]
    };
  }

  getUniqueImage(category = 'wedding') {
    let cat = category.toLowerCase();
    
    // Normalize mapping
    if (cat.includes('estate') || cat.includes('property') || cat.includes('commercial')) cat = 'real_estate';
    else if (cat.includes('cinematic') || cat.includes('moody') || cat.includes('apparel')) cat = 'fashion';
    else if (cat.includes('traditional')) cat = 'wedding';
    else if (cat.includes('editorial')) cat = 'portrait';
    else if (cat.includes('baby') || cat.includes('maternity')) cat = 'family';
    else if (cat.includes('fort') || cat.includes('palace') || cat.includes('monument')) cat = 'monument';

    const pool = this.cloudinaryImages[cat] || this.cloudinaryImages['general'] || this.cloudinaryImages['wedding'];
    
    // Cycle through images using a counter so we never run out
    if (!this.dynamicCounters[cat]) this.dynamicCounters[cat] = 0;
    
    const imageIndex = this.dynamicCounters[cat] % pool.length;
    this.dynamicCounters[cat]++;
    
    return pool[imageIndex];
  }
}

export const imageManager = new ImageManager();
