import { prisma } from "./config/prisma";
import fruits_vegetables from "./assets/fruits_vegetables.png";
import dairy_eggs from "./assets/dairy_eggs.png";
import bakery from "./assets/bakery.png";
import drinks from "./assets/drinks.png";
import pantry_staples from "./assets/pantry_staples.png";
import snacks from "./assets/snacks.png";
import frozen_foods from "./assets/frozen_foods.png";
import personal_care from "./assets/personal_care.png";
import baby_care from "./assets/baby_care.png";
import meat_seafood from "./assets/meat_seafood.png";

const seedDB = async () => {
    try {
        // Clear existing data
        await prisma.product.deleteMany({});
        await prisma.category.deleteMany({});
        console.log("Cleared existing products and categories");

        // Create categories
        const categories = await prisma.category.createMany({
            data: [
                {
                    name: "Fruits & Vegetables",
                    slug: "fruits-vegetables",
                    image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/fruits_vegetables.png",
                },
            ],
        });

        console.log(`Created ${categories.count} categories`);

        // Fetch all categories for reference
        const categoryMap: any = {};
        const allCategories = await prisma.category.findMany();
        allCategories.forEach((cat) => {
            categoryMap[cat.slug] = cat.id;
        });

        const products: any = [
            {
                name: "Carrot 500g",
                description: "Sweet and crunchy, Good for eyesight, Ideal for juices and salads",
                price: 44,
                originalPrice: 50,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/ceqgisupuizyste9aifg.png",
                category: "fruits-vegetables",
                unit: "500g",
                stock: 100,
                isOrganic: true,
                rating: 4.5,
                reviewCount: 12,
            },
            {
                name: "Onion 500g",
                description: "Fresh and pungent, Perfect for cooking, A kitchen staple",
                price: 45,
                originalPrice: 50,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/wnvtwlm2tphqburhsmyc.png",
                category: "fruits-vegetables",
                unit: "500g",
                stock: 100,
                isOrganic: false,
                rating: 4.5,
                reviewCount: 12,
            },
            {
                name: "Spinach 500g",
                description: "Rich in iron, High in vitamins, Perfect for soups and salads",
                price: 15,
                originalPrice: 18,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/bhrtl76sscvmeiq4kchm.png",
                category: "fruits-vegetables",
                unit: "500g",
                stock: 100,
                isOrganic: true,
                rating: 4.5,
                reviewCount: 12,
            },
            {
                name: "Tomato 1 kg",
                description: "Juicy and ripe, Rich in Vitamin C, Perfect for salads and sauces, Farm fresh quality",
                price: 28,
                originalPrice: 30,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/kdbfytxisrjymgy0ubhk.png",
                category: "fruits-vegetables",
                unit: "1kg",
                stock: 100,
                isOrganic: true,
                rating: 4.5,
                reviewCount: 12,
            },
            {
                name: "Potato 500g",
                description: "Fresh and organic, Rich in carbohydrates, Ideal for curries and fries",
                price: 35,
                originalPrice: 40,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/tzibj2ntsnbn4e0u5kwv.png",
                category: "fruits-vegetables",
                unit: "500g",
                stock: 100,
                isOrganic: true,
                rating: 4.5,
                reviewCount: 12,
            },
            {
                name: "Calabrese Broccoli 500g",
                description: "Green and tender broccoli, Rich in Vitamin C, Perfect for steaming and stir-fry",
                price: 65,
                originalPrice: 75,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/calabrese.png",
                category: "fruits-vegetables",
                unit: "500g",
                stock: 100,
                isOrganic: true,
                rating: 4.6,
                reviewCount: 18,
            },
            {
                name: "Bell Pepper Mix 500g",
                description: "Colorful sweet peppers, Rich in antioxidants, Perfect for salads and cooking",
                price: 55,
                originalPrice: 65,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/bell_pepper.png",
                category: "fruits-vegetables",
                unit: "500g",
                stock: 100,
                isOrganic: true,
                rating: 4.4,
                reviewCount: 15,
            },
            {
                name: "Cucumber 500g",
                description: "Fresh and crisp, Low in calories, Perfect for salads and juices",
                price: 25,
                originalPrice: 30,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/cucumber.png",
                category: "fruits-vegetables",
                unit: "500g",
                stock: 100,
                isOrganic: false,
                rating: 4.3,
                reviewCount: 10,
            },
            {
                name: "Cabbage 1 kg",
                description: "Green and crunchy, Rich in nutrients, Perfect for coleslaw and cooking",
                price: 35,
                originalPrice: 45,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/cabbage.png",
                category: "fruits-vegetables",
                unit: "1kg",
                stock: 100,
                isOrganic: false,
                rating: 4.2,
                reviewCount: 12,
            },
            {
                name: "Cauliflower 500g",
                description: "White and tender florets, Rich in Vitamin K, Perfect for curries and roasting",
                price: 45,
                originalPrice: 55,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/cauliflower.png",
                category: "fruits-vegetables",
                unit: "500g",
                stock: 100,
                isOrganic: true,
                rating: 4.5,
                reviewCount: 14,
            },
            {
                name: "Peas 500g",
                description: "Sweet and tender peas, Rich in protein, Perfect for dal and rice preparations",
                price: 55,
                originalPrice: 65,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/peas.png",
                category: "fruits-vegetables",
                unit: "500g",
                stock: 100,
                isOrganic: false,
                rating: 4.4,
                reviewCount: 11,
            },
            {
                name: "Radish 500g",
                description: "Crunchy and peppery, Low in calories, Perfect for salads",
                price: 20,
                originalPrice: 25,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/radish.png",
                category: "fruits-vegetables",
                unit: "500g",
                stock: 100,
                isOrganic: true,
                rating: 4.1,
                reviewCount: 8,
            },
            {
                name: "Bottle Gourd 1 kg",
                description: "Light and nutritious, Perfect for curries, Low in calories",
                price: 30,
                originalPrice: 35,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/bottle_gourd.png",
                category: "fruits-vegetables",
                unit: "1kg",
                stock: 100,
                isOrganic: false,
                rating: 4.3,
                reviewCount: 9,
            },
            {
                name: "Bitter Melon 500g",
                description: "Bitter and medicinal, Rich in vitamins, Great for health",
                price: 40,
                originalPrice: 50,
                image: "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/bitter_melon.png",
                category: "fruits-vegetables",
                unit: "500g",
                stock: 100,
                isOrganic: true,
                rating: 4.0,
                reviewCount: 7,
            },
        ];

        // Transform products to use categoryId
        const productsWithCategoryId = products.map((p: any) => {
            const { category, ...rest } = p;
            return {
                ...rest,
                categoryId: categoryMap[category],
            };
        });

        await prisma.product.createMany({ data: productsWithCategoryId });
        console.log(`Created ${productsWithCategoryId.length} products`);

        console.log("Seed completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

seedDB();
