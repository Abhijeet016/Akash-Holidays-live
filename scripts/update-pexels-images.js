require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') })
const mongoose = require('mongoose')

const PEXELS_IMAGE_MAP = {
  'Thailand':    'https://images.pexels.com/photos/30540817/pexels-photo-30540817.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'Indonesia':   'https://images.pexels.com/photos/18340431/pexels-photo-18340431.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'Malaysia':    'https://images.pexels.com/photos/18662417/pexels-photo-18662417.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'Turkey':      'https://images.pexels.com/photos/36673126/pexels-photo-36673126.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'Himachal':    'https://images.pexels.com/photos/842155/pexels-photo-842155.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'Uttarakhand': 'https://images.pexels.com/photos/19194412/pexels-photo-19194412.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'Kashmir':     'https://images.pexels.com/photos/18453079/pexels-photo-18453079.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'Ladakh':      'https://images.pexels.com/photos/38087449/pexels-photo-38087449.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
}

async function run() {
  const uri = process.env.MONGO_URI
  if (!uri) { console.error('MONGO_URI not set'); process.exit(1) }

  await mongoose.connect(uri)
  console.log('Connected to MongoDB')

  const PackageSchema = new mongoose.Schema({ img: String, dest: String, nights: String, persons: String, discount: String, desc: String }, { strict: false })
  const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema)

  const packages = await Package.find({})
  console.log(`Found ${packages.length} packages`)

  let updated = 0
  for (const pkg of packages) {
    const url = PEXELS_IMAGE_MAP[pkg.dest]
    if (url) {
      await Package.updateOne({ _id: pkg._id }, { $set: { img: url } })
      console.log(`✓ Updated "${pkg.dest}" → Pexels URL`)
      updated++
    } else {
      console.log(`- Skipped "${pkg.dest}" (no matching Pexels URL)`)
    }
  }

  console.log(`\nDone. Updated ${updated}/${packages.length} packages.`)
  await mongoose.disconnect()
}

run().catch(err => { console.error(err); process.exit(1) })
