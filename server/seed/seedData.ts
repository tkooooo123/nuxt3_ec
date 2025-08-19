import bcrypt from 'bcrypt'
import User from '../models/User'
import Product from '../models/Product'
import Category from '../models/Category'
import { connectDB } from '../utils/mongoose'

export const seedUser = async () => {
  try {
    await connectDB()
    const usersData = [
      {
        name: "admin",
        email: "admin@gmail.com",
        password: "12345678",
        role: "admin",
      },
      {
        name: "user1",
        email: "user1@gmail.com",
        password: "12345678",
        role: "user",
      },
      {
        name: "user2",
        email: "user2@gmail.com",
        password: "12345678",
        role: "user",
      },
    ]

    for (const user of usersData) {
      const exists = await User.findOne({ email: user.email })
      if (exists) continue // 改成 continue，避免只要找到一個就結束迴圈

      const hashedPassword = await bcrypt.hash(user.password, 10)

      const newUser = new User({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role
      })

      await newUser.save()
      console.log(`User ${user.email} created`)
    }
  } catch (error) {
    console.log(error)
  }
}

export const seedProduct = async () => {
  try {
    await connectDB()
    let category = await Category.findOne({ name: '泡芙' })

    if (!category) {
      category = await Category.create({
        name: '泡芙',
        description: 'test'
      })
    }
    console.log(category)
    const productData = [
      {
        name: '奶油泡芙',
        image:
          'https://res.cloudinary.com/dbfvtcjog/image/upload/v1752407028/jwyxe8hkefo3pyqlvp8m.jpg',
        description: '酥脆外皮 × 滑順內餡，奶香四溢的法式享受',
        quantity: 100,
        price: 45,
        isEnabled: true,
        content:
          '1. 外皮酥脆，內餡香濃滑順，層次豐富<br/>2. 採用法國進口奶油與天然香草籽製作<br/>3. 冷藏食用口感最佳，適合下午茶或送禮',
        imagesUrl: [
          'https://res.cloudinary.com/dbfvtcjog/image/upload/v1752407315/h4oycfnfn2vclhw3zhte.png'
        ],
        unit: '顆',
        category: category._id,
        is_hottest: true,
        is_newest: false,
        material: '法國奶油、雞蛋、麵粉、天然香草籽',
        notice:
          '1. 冷藏保存，建議三日內食用完畢<br/>2. 含奶製品與蛋製品，過敏者請留意<br/>3. 避免陽光直射與高溫環境',
        origin_price: 60,
        size: '單顆裝（約6cm直徑）',
        style: '日式匠心 × 法式工藝'
      },
      {
        name: '藍莓泡芙',
        image:
          'https://res.cloudinary.com/dbfvtcjog/image/upload/v1755419676/lqxkfubusjlxzgu5j9sn.jpg',
        description: '酥脆外皮 × 藍莓果香內餡，酸甜交織的清爽享受',
        quantity: 100,
        price: 45,
        origin_price: 60,
        isEnabled: true,
        content:
          '1. 外皮金黃酥脆，內餡帶有藍莓果粒與淡淡酸甜<br/>2. 使用新鮮藍莓熬煮果醬搭配法國奶油<br/>3. 冷藏食用清爽解膩，適合夏日午茶',
        imagesUrl: [
          'https://res.cloudinary.com/dbfvtcjog/image/upload/v1755419684/tudjcgo2pu2m1knt8lki.png'
        ],
        unit: '顆',
        is_hottest: false,
        is_newest: true,
        notice:
          '1. 冷藏保存，建議三日內食用完畢<br/>2. 含奶製品與蛋製品，過敏者請留意<br/>3. 避免陽光直射與高溫環境',
        material: '新鮮藍莓、法國奶油、雞蛋、麵粉、天然香草籽',
        size: '單顆裝（約6cm直徑）',
        style: '清新果香 × 法式工藝',
        category: category._id,
      }
    ]

    for (const product of productData) {
      await Product.create({ ...product })
    }
    console.log('Products created!')
  } catch (error) {
    console.log(error)
  }
}

//seedUser();
