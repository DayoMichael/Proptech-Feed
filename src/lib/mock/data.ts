import type { Comment, FeedPage, MediaItem, Post, Story, User } from "@/types";
import { blurDataUrl } from "@/lib/blur";

const avatar = (n: number) => `https://i.pravatar.cc/120?img=${n}`;

// Real estate / interior photos (Unsplash). A seed maps deterministically to
// one of these so the same post always shows the same picture.
const HOUSING_IMAGE_IDS = [
  "1568605114967-8130f3a36994",
  "1570129477492-45c003edd2be",
  "1512917774080-9991f1c4c750",
  "1605276374104-dee2a0ed3cd6",
  "1600596542815-ffad4c1539a9",
  "1600585154340-be6161a56a0c",
  "1600607687939-ce8a6c25118c",
  "1600566753086-00f18fb6b3ea",
  "1600210492486-724fe5c67fb0",
  "1600121848594-d8644e57abab",
  "1502672260266-1c1ef2d93688",
  "1493809842364-78817add7ffb",
  "1484154218962-a197022b5858",
  "1565182999561-18d7dc61c393",
  "1564013799919-ab600027ffc6",
  "1502005229762-cf1b2da7c5d6",
  "1583608205776-bfd35f0d9f83",
  "1502005097973-6a7082348e28",
  "1493663284031-b7e3aefcae8e",
  "1600047509807-ba8f99d2cdde",
  "1600573472550-8090b5e0745e",
  "1576941089067-2de3c901e126",
  "1598228723793-52759bba239c",
  "1567496898669-ee935f5f647a",
  "1554995207-c18c203602cb",
  "1502673530728-f79b4cab31b1",
  "1505691938895-1758d7feb511",
  "1522708323590-d24dbb6b0267",
];

function seedToIndex(seed: string, length: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % length;
}

const photo = (seed: string, w: number) =>
  `https://images.unsplash.com/photo-${
    HOUSING_IMAGE_IDS[seedToIndex(seed, HOUSING_IMAGE_IDS.length)]
  }?auto=format&fit=crop&q=80&w=${w}`;

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

function minutesAgo(min: number): string {
  return new Date(Date.now() - min * 60_000).toISOString();
}

export const users: Record<string, User> = {
  maurice: {
    id: "maurice",
    name: "Maurice U.",
    handle: "maurice_u",
    avatarUrl: avatar(12),
    type: "individual",
  },
  dan: {
    id: "dan",
    name: "Stranger Dan",
    handle: "stranger.dan",
    avatarUrl: avatar(13),
    type: "agent",
    verified: true,
  },
  felix: {
    id: "felix",
    name: "Felix Okon",
    handle: "felix.okon",
    avatarUrl: avatar(14),
    type: "broker",
  },
  boyd: {
    id: "boyd",
    name: "Boyd From",
    handle: "boyd.from",
    avatarUrl: avatar(15),
    type: "developer",
  },
  ima: {
    id: "ima",
    name: "Ima Ntuen",
    handle: "ima.ntuen",
    avatarUrl: avatar(45),
    type: "owner",
  },
  daniel: {
    id: "daniel",
    name: "Daniel David",
    handle: "daniel.david",
    avatarUrl: avatar(17),
    type: "agent",
    verified: true,
  },
  amaka: {
    id: "amaka",
    name: "Amaka Eze",
    handle: "amaka.eze",
    avatarUrl: avatar(32),
    type: "agent",
  },
  miracle: {
    id: "miracle",
    name: "miracle.h",
    handle: "miracle.h",
    avatarUrl: avatar(5),
    type: "individual",
  },
  tunde: {
    id: "tunde",
    name: "tunde_b",
    handle: "tunde_b",
    avatarUrl: avatar(8),
    type: "individual",
  },
  chidi: {
    id: "chidi",
    name: "Chidi O.",
    handle: "chidi.o",
    avatarUrl: avatar(33),
    type: "individual",
  },
  zainab: {
    id: "zainab",
    name: "Zainab A.",
    handle: "zainab.a",
    avatarUrl: avatar(31),
    type: "individual",
  },
};

/** The signed-in viewer (drives "your" avatar, story, and composer). */
export const currentUser: User = users.miracle;

const img = (seed: string, w: number, h: number, alt: string): MediaItem => ({
  type: "image",
  url: photo(seed, w),
  width: w,
  height: h,
  alt,
  blurDataURL: blurDataUrl(seed),
});

const video = (poster: string, alt: string): MediaItem => ({
  type: "video",
  url: SAMPLE_VIDEO,
  poster: photo(poster, 1280),
  width: 1280,
  height: 720,
  durationMs: 20_000,
  alt,
  blurDataURL: blurDataUrl(poster),
});

export const comments: Record<string, Comment> = {
  c1: {
    id: "c1",
    postId: "p1",
    authorId: "tunde",
    text: "Roads around Admiralty are still bad. Thanks for checking in 🙏",
    createdAt: minutesAgo(30),
    likeCount: 3,
    likedByMe: false,
    replyCount: 2,
  },
  c1a: {
    id: "c1a",
    postId: "p1",
    parentId: "c1",
    authorId: "maurice",
    text: "Stay safe! There's a dry spot near the Admiralty roundabout if you need it.",
    createdAt: minutesAgo(24),
    likeCount: 1,
    likedByMe: false,
    replyCount: 1,
  },
  c1b: {
    id: "c1b",
    postId: "p1",
    parentId: "c1a",
    authorId: "tunde",
    text: "Appreciate it 🙏 will head there.",
    createdAt: minutesAgo(18),
    likeCount: 0,
    likedByMe: false,
    replyCount: 0,
  },
  c1c: {
    id: "c1c",
    postId: "p1",
    parentId: "c1",
    authorId: "chidi",
    text: "Same on my street  water finally receding though.",
    createdAt: minutesAgo(12),
    likeCount: 0,
    likedByMe: false,
    replyCount: 0,
  },
  c2: {
    id: "c2",
    postId: "p2",
    authorId: "miracle",
    text: "Is the rent negotiable? Interested for my client.",
    createdAt: minutesAgo(180),
    likeCount: 1,
    likedByMe: false,
    replyCount: 1,
  },
  c2a: {
    id: "c2a",
    postId: "p2",
    parentId: "c2",
    authorId: "dan",
    text: "Yes, slightly. Send me a DM and we'll talk numbers.",
    createdAt: minutesAgo(150),
    likeCount: 2,
    likedByMe: false,
    replyCount: 0,
  },
  c3: {
    id: "c3",
    postId: "p4",
    authorId: "miracle",
    text: "Is the rent negotiable? Interested for my client.",
    createdAt: minutesAgo(600),
    likeCount: 0,
    likedByMe: false,
    replyCount: 0,
  },
};

const curatedPosts: Post[] = [
  {
    id: "p1",
    authorId: "maurice",
    category: "general",
    createdAt: minutesAgo(1),
    text: "How is everyone holding up with the flooding in Lekki this week? Stay safe out there  and let me know if anyone needs a temporary place to crash 🙏",
    location: "Lekki Phase 1, Lagos",
    tags: [],
    media: [],
    likeCount: 8,
    likedByMe: false,
    likedByPreview: ["miracle", "tunde", "chidi"],
    commentCount: 7,
    topCommentId: "c1",
    bookmarkCount: 2,
    savedByMe: false,
    shareCount: 1,
  },
  {
    id: "p2",
    authorId: "dan",
    category: "property",
    createdAt: minutesAgo(720),
    text: "Newly serviced 3-bedroom apartment with fitted kitchen, parking for 3 cars, and 24/7 power. Inspection opens this Saturday.",
    location: "Lekki Phase 1, Lagos",
    price: 85000000,
    tags: ["for_sale"],
    media: [
      img("el-dan-1", 1280, 854, "Modern serviced apartment exterior at dusk"),
      img("el-dan-2", 1280, 854, "Open-plan living room with natural light"),
      img("el-dan-3", 1280, 854, "Fitted kitchen with island counter"),
    ],
    likeCount: 23,
    likedByMe: false,
    likedByPreview: ["miracle", "amaka", "zainab"],
    commentCount: 3,
    topCommentId: "c2",
    bookmarkCount: 2,
    savedByMe: false,
    shareCount: 4,
  },
  {
    id: "p3",
    authorId: "felix",
    category: "property",
    createdAt: minutesAgo(900),
    text: "Looking for a 2-bedroom apartment in Yaba or Akoka. Must have constant water and parking for one car. Moving in by end of next month. Inspection opens this Saturday.",
    location: "Yaba, Lagos",
    price: 4000000,
    tags: ["for_rent"],
    media: [],
    likeCount: 1,
    likedByMe: false,
    likedByPreview: ["miracle"],
    commentCount: 0,
    bookmarkCount: 0,
    savedByMe: false,
    shareCount: 0,
  },
  {
    id: "p4",
    authorId: "boyd",
    category: "property",
    createdAt: minutesAgo(1200),
    text: "Newly serviced 3-bedroom apartment with fitted kitchen, parking for 3 cars, and 24/7 power. Inspection opens this Saturday.",
    location: "Lekki Phase 1, Lagos",
    price: 6500000,
    tags: ["for_rent"],
    media: [
      img("el-boyd-1", 1280, 854, "Serviced apartment block frontage"),
      img("el-boyd-2", 1280, 854, "Bright bedroom with fitted wardrobe"),
    ],
    likeCount: 23,
    likedByMe: false,
    likedByPreview: ["miracle", "chidi", "zainab"],
    commentCount: 3,
    topCommentId: "c3",
    bookmarkCount: 2,
    savedByMe: false,
    shareCount: 2,
  },
  {
    id: "p5",
    authorId: "ima",
    category: "property",
    createdAt: minutesAgo(905),
    text: "Tour of a 2-bedroom apartment in Yaba  constant water, parking for one car, 24/7 power. Inspection opens this Saturday.",
    location: "Lekki Phase 1, Lagos",
    price: 5000000,
    tags: ["for_rent"],
    media: [
      video(
        "el-ima-poster",
        "Walkthrough tour of a furnished 2-bedroom apartment",
      ),
    ],
    likeCount: 1,
    likedByMe: false,
    likedByPreview: ["miracle"],
    commentCount: 0,
    bookmarkCount: 1,
    savedByMe: false,
    shareCount: 0,
  },
  {
    id: "p6",
    authorId: "daniel",
    category: "property",
    createdAt: minutesAgo(120),
    text: "Newly serviced 3-bedroom apartment with fitted kitchen, parking for 3 cars, and 24/7 power. Inspection opens this Saturday.",
    location: "Lekki Phase 1, Lagos",
    price: 95000000,
    tags: ["for_sale"],
    media: [
      img(
        "el-daniel-1",
        1280,
        960,
        "Furnished living area with feature artwork",
      ),
    ],
    likeCount: 23,
    likedByMe: false,
    likedByPreview: ["miracle", "amaka", "tunde"],
    commentCount: 2,
    bookmarkCount: 2,
    savedByMe: false,
    shareCount: 3,
  },
  {
    id: "p7",
    authorId: "amaka",
    category: "property",
    createdAt: minutesAgo(240),
    text: "Just listed: 4-bedroom semi-detached duplex with a private terrace and BQ. Serious buyers only  inspection by appointment.",
    location: "Ikoyi, Lagos",
    price: 180000000,
    tags: ["for_sale"],
    media: [
      img("el-amaka-1", 1280, 854, "Semi-detached duplex with private terrace"),
      img("el-amaka-2", 1280, 854, "Terrace overlooking the garden"),
      img("el-amaka-3", 1280, 854, "Spacious en-suite bedroom"),
      img("el-amaka-4", 1280, 854, "Boys' quarters entrance"),
    ],
    likeCount: 41,
    likedByMe: false,
    likedByPreview: ["miracle", "chidi", "zainab"],
    commentCount: 5,
    bookmarkCount: 9,
    savedByMe: false,
    shareCount: 6,
  },
  {
    id: "p8",
    authorId: "chidi",
    category: "property",
    createdAt: minutesAgo(360),
    text: "Quick walkthrough of a shortlet studio in VI  perfect for a weekend stay. Fast Wi-Fi and 24/7 power included.",
    location: "Victoria Island, Lagos",
    price: 3000000,
    tags: ["for_rent"],
    media: [
      video("el-chidi-poster", "Walkthrough of a shortlet studio apartment"),
    ],
    likeCount: 12,
    likedByMe: false,
    likedByPreview: ["miracle", "amaka"],
    commentCount: 1,
    bookmarkCount: 3,
    savedByMe: false,
    shareCount: 1,
  },
  {
    id: "p9",
    authorId: "maurice",
    category: "general",
    createdAt: minutesAgo(80),
    text: "PSA: traffic on the Lekki–Epe expressway is mad today. Leave early if you have an inspection 🙏",
    location: "Surulere, Lagos",
    tags: [],
    media: [],
    likeCount: 14,
    likedByMe: false,
    likedByPreview: ["amaka", "tunde", "zainab"],
    commentCount: 0,
    bookmarkCount: 1,
    savedByMe: false,
    shareCount: 2,
  },
  {
    id: "p10",
    authorId: "amaka",
    category: "property",
    createdAt: minutesAgo(160),
    text: "Just listed  5-bedroom detached duplex with a swimming pool and full BQ. Premium finishing throughout.",
    location: "Ikeja GRA, Lagos",
    price: 120000000,
    tags: ["for_sale"],
    media: [img("el-p10-1", 1280, 854, "Detached duplex with swimming pool")],
    likeCount: 31,
    likedByMe: false,
    likedByPreview: ["miracle", "dan", "zainab"],
    commentCount: 0,
    bookmarkCount: 6,
    savedByMe: false,
    shareCount: 5,
  },
  {
    id: "p11",
    authorId: "dan",
    category: "property",
    createdAt: minutesAgo(200),
    text: "Affordable 2-bedroom flats now available in Ajah. Tiled floors, en-suite rooms, secure estate.",
    location: "Ajah, Lagos",
    price: 8500000,
    tags: ["for_rent"],
    media: [
      img("el-p11-1", 1280, 854, "Estate entrance with gatehouse"),
      img("el-p11-2", 1280, 854, "Tiled living room"),
      img("el-p11-3", 1280, 854, "En-suite bedroom"),
    ],
    likeCount: 9,
    likedByMe: false,
    likedByPreview: ["miracle", "felix"],
    commentCount: 0,
    bookmarkCount: 2,
    savedByMe: false,
    shareCount: 1,
  },
  {
    id: "p12",
    authorId: "boyd",
    category: "property",
    createdAt: minutesAgo(280),
    text: "Walkthrough of our newest terrace development in Magodo. Handover starts next quarter.",
    location: "Magodo, Lagos",
    price: 210000000,
    tags: ["for_sale"],
    media: [video("el-p12-poster", "Terrace development walkthrough")],
    likeCount: 27,
    likedByMe: false,
    likedByPreview: ["amaka", "daniel", "zainab"],
    commentCount: 0,
    bookmarkCount: 8,
    savedByMe: false,
    shareCount: 4,
  },
  {
    id: "p13",
    authorId: "chidi",
    category: "general",
    createdAt: minutesAgo(330),
    text: "Finally moved into my new place in Yaba 🎉 Thanks to everyone who shared listings!",
    location: "Yaba, Lagos",
    tags: [],
    media: [img("el-p13-1", 1280, 960, "Cozy furnished apartment corner")],
    likeCount: 52,
    likedByMe: false,
    likedByPreview: ["miracle", "amaka", "tunde"],
    commentCount: 0,
    bookmarkCount: 1,
    savedByMe: false,
    shareCount: 0,
  },
  {
    id: "p14",
    authorId: "felix",
    category: "property",
    createdAt: minutesAgo(390),
    text: "Luxury 4-bedroom maisonette in Ikoyi  private elevator, smart home system, rooftop lounge.",
    location: "Ikoyi, Lagos",
    price: 320000000,
    tags: ["for_sale"],
    media: [
      img("el-p14-1", 1280, 854, "Maisonette frontage at dusk"),
      img("el-p14-2", 1280, 854, "Open-plan kitchen and dining"),
      img("el-p14-3", 1280, 854, "Rooftop lounge"),
      img("el-p14-4", 1280, 854, "Master suite with city view"),
    ],
    likeCount: 64,
    likedByMe: false,
    likedByPreview: ["miracle", "amaka", "dan"],
    commentCount: 0,
    bookmarkCount: 12,
    savedByMe: false,
    shareCount: 9,
  },
  {
    id: "p15",
    authorId: "ima",
    category: "property",
    createdAt: minutesAgo(450),
    text: "Serviced studio in VI available for short or long lets. Wi-Fi, 24/7 power, weekly cleaning.",
    location: "Victoria Island, Lagos",
    price: 7000000,
    tags: ["for_rent"],
    media: [img("el-p15-1", 1280, 854, "Serviced studio interior")],
    likeCount: 18,
    likedByMe: false,
    likedByPreview: ["miracle", "chidi"],
    commentCount: 0,
    bookmarkCount: 3,
    savedByMe: false,
    shareCount: 1,
  },
  {
    id: "p16",
    authorId: "zainab",
    category: "general",
    createdAt: minutesAgo(520),
    text: "Does anyone have recommendations for a reliable plumber around Lekki? DMs open 🙏",
    location: "Lekki Phase 1, Lagos",
    tags: [],
    media: [],
    likeCount: 6,
    likedByMe: false,
    likedByPreview: ["tunde"],
    commentCount: 0,
    bookmarkCount: 0,
    savedByMe: false,
    shareCount: 0,
  },
  {
    id: "p17",
    authorId: "daniel",
    category: "property",
    createdAt: minutesAgo(600),
    text: "Brand new 3-bedroom apartment for sale in Lekki. C-of-O, ample parking, gym and pool on site.",
    location: "Lekki Phase 1, Lagos",
    price: 65000000,
    tags: ["for_sale"],
    media: [img("el-p17-1", 1280, 854, "Apartment block with pool")],
    likeCount: 22,
    likedByMe: false,
    likedByPreview: ["miracle", "amaka"],
    commentCount: 0,
    bookmarkCount: 4,
    savedByMe: false,
    shareCount: 2,
  },
  {
    id: "p18",
    authorId: "tunde",
    category: "property",
    createdAt: minutesAgo(700),
    text: "Budget-friendly 1-bedroom flats in Surulere. Perfect for young professionals. Inspection daily.",
    location: "Surulere, Lagos",
    price: 3500000,
    tags: ["for_rent"],
    media: [
      img("el-p18-1", 1280, 854, "Compact flat living area"),
      img("el-p18-2", 1280, 854, "Kitchenette"),
    ],
    likeCount: 11,
    likedByMe: false,
    likedByPreview: ["miracle", "zainab"],
    commentCount: 0,
    bookmarkCount: 2,
    savedByMe: false,
    shareCount: 1,
  },
  {
    id: "p19",
    authorId: "amaka",
    category: "property",
    createdAt: minutesAgo(800),
    text: "Quick tour of a 3-bedroom terrace in Ikeja GRA  available for rent from next month.",
    location: "Ikeja GRA, Lagos",
    price: 9000000,
    tags: ["for_rent"],
    media: [video("el-p19-poster", "Three-bedroom terrace rental tour")],
    likeCount: 19,
    likedByMe: false,
    likedByPreview: ["miracle", "daniel"],
    commentCount: 0,
    bookmarkCount: 3,
    savedByMe: false,
    shareCount: 2,
  },
  {
    id: "p20",
    authorId: "dan",
    category: "property",
    createdAt: minutesAgo(900),
    text: "Land for sale in Ajah  600sqm, dry land, registered survey. Great for a private build.",
    location: "Ajah, Lagos",
    price: 45000000,
    tags: ["for_sale"],
    media: [img("el-p20-1", 1280, 854, "Surveyed plot of land")],
    likeCount: 8,
    likedByMe: false,
    likedByPreview: ["felix"],
    commentCount: 0,
    bookmarkCount: 1,
    savedByMe: false,
    shareCount: 0,
  },
];

const GEN_AUTHORS = [
  "dan",
  "amaka",
  "felix",
  "boyd",
  "ima",
  "daniel",
  "chidi",
  "zainab",
  "tunde",
  "maurice",
];
const GEN_LOCATIONS = [
  "Lekki Phase 1, Lagos",
  "Ikoyi, Lagos",
  "Victoria Island, Lagos",
  "Yaba, Lagos",
  "Surulere, Lagos",
  "Ikeja GRA, Lagos",
  "Magodo, Lagos",
  "Ajah, Lagos",
];
const GEN_SALE_PRICES = [
  25_000_000, 45_000_000, 65_000_000, 85_000_000, 120_000_000, 180_000_000,
  250_000_000,
];
const GEN_RENT_PRICES = [
  2_500_000, 3_500_000, 4_500_000, 6_000_000, 8_000_000, 9_500_000,
];
const GEN_TEXTS = [
  "Anyone know a good spot for an inspection this weekend? Sharing leads in the comments.",
  "Market update: prices around this axis have been steady this quarter. What are you seeing?",
  "Moving soon and looking for honest agent recommendations 🙏",
  "Just toured a lovely place here  great natural light and constant power.",
  "Reminder: always verify documents before paying any agent. Stay safe out there.",
  "Weekend open house was packed! Thanks to everyone who came through.",
];

// Deterministic filler posts so the feed is large enough to exercise infinite
// scroll and virtualization. Values are derived from the index (no randomness)
// to keep server and client render output identical.
function buildMorePosts(from: number, to: number): Post[] {
  const list: Post[] = [];
  for (let i = from; i <= to; i++) {
    const id = `p${i}`;
    const base = {
      id,
      authorId: GEN_AUTHORS[i % GEN_AUTHORS.length],
      createdAt: minutesAgo(60 + i * 17),
      location: GEN_LOCATIONS[i % GEN_LOCATIONS.length],
      likeCount: (i * 7) % 90,
      likedByMe: false,
      likedByPreview: [
        GEN_AUTHORS[(i + 1) % GEN_AUTHORS.length],
        GEN_AUTHORS[(i + 3) % GEN_AUTHORS.length],
      ],
      commentCount: 0,
      bookmarkCount: i % 7,
      savedByMe: false,
      shareCount: i % 4,
    };
    switch (i % 5) {
      case 0:
        list.push({
          ...base,
          category: "general",
          text: GEN_TEXTS[i % GEN_TEXTS.length],
          tags: [],
          media: [],
        });
        break;
      case 1:
        list.push({
          ...base,
          category: "property",
          text: "Spacious property with modern finishing, secure estate, and 24/7 power. Inspection by appointment.",
          price: GEN_SALE_PRICES[i % GEN_SALE_PRICES.length],
          tags: ["for_sale"],
          media: [img(`gen-${i}-1`, 1280, 854, "Property exterior")],
        });
        break;
      case 2:
        list.push({
          ...base,
          category: "property",
          text: "Newly built apartment available for rent. Fitted kitchen, ample parking, great location.",
          price: GEN_RENT_PRICES[i % GEN_RENT_PRICES.length],
          tags: ["for_rent"],
          media: [
            img(`gen-${i}-1`, 1280, 854, "Apartment living room"),
            img(`gen-${i}-2`, 1280, 854, "Bedroom with fitted wardrobe"),
            img(`gen-${i}-3`, 1280, 854, "Fitted kitchen"),
          ],
        });
        break;
      case 3:
        list.push({
          ...base,
          category: "property",
          text: "Video walkthrough of this listing. Tap to play and take a closer look.",
          price: GEN_SALE_PRICES[(i + 2) % GEN_SALE_PRICES.length],
          tags: ["for_sale"],
          media: [video(`gen-${i}-poster`, "Property walkthrough")],
        });
        break;
      default:
        list.push({
          ...base,
          category: "general",
          text: GEN_TEXTS[(i + 2) % GEN_TEXTS.length],
          tags: [],
          media: [img(`gen-${i}-1`, 1280, 960, "Neighbourhood snapshot")],
        });
    }
  }
  return list;
}

export const posts: Post[] = [...curatedPosts, ...buildMorePosts(21, 100)];

// Portrait media sized for the full-screen story viewer (9:16).
const storyImg = (seed: string, alt: string): MediaItem => ({
  type: "image",
  url: photo(seed, 1080),
  width: 1080,
  height: 1920,
  alt,
  blurDataURL: blurDataUrl(seed),
});

const storyVideo = (poster: string, alt: string): MediaItem => ({
  type: "video",
  url: SAMPLE_VIDEO,
  poster: photo(poster, 1080),
  width: 1080,
  height: 1920,
  durationMs: 15_000,
  alt,
  blurDataURL: blurDataUrl(poster),
});

const IMAGE_STORY_MS = 5_000;

export const stories: Story[] = [
  {
    id: "st-dan",
    userId: "dan",
    segments: [
      {
        id: "st-dan-1",
        media: storyImg("st-dan-a", "Open house this weekend"),
        durationMs: IMAGE_STORY_MS,
        createdAt: minutesAgo(40),
      },
      {
        id: "st-dan-2",
        media: storyImg("st-dan-b", "Living room walkthrough"),
        durationMs: IMAGE_STORY_MS,
        createdAt: minutesAgo(38),
      },
    ],
  },
  {
    id: "st-daniel",
    userId: "daniel",
    segments: [
      {
        id: "st-daniel-1",
        media: storyVideo("st-daniel-a", "Quick tour of a new listing"),
        durationMs: 15_000,
        createdAt: minutesAgo(60),
      },
    ],
  },
  {
    id: "st-amaka",
    userId: "amaka",
    segments: [
      {
        id: "st-amaka-1",
        media: storyImg("st-amaka-a", "Terrace view at sunset"),
        durationMs: IMAGE_STORY_MS,
        createdAt: minutesAgo(90),
      },
      {
        id: "st-amaka-2",
        media: storyImg("st-amaka-b", "Master en-suite"),
        durationMs: IMAGE_STORY_MS,
        createdAt: minutesAgo(88),
      },
      {
        id: "st-amaka-3",
        media: storyImg("st-amaka-c", "Private garden"),
        durationMs: IMAGE_STORY_MS,
        createdAt: minutesAgo(85),
      },
    ],
  },
  {
    id: "st-boyd",
    userId: "boyd",
    segments: [
      {
        id: "st-boyd-1",
        media: storyImg("st-boyd-a", "Construction update"),
        durationMs: IMAGE_STORY_MS,
        createdAt: minutesAgo(180),
      },
    ],
  },
  {
    id: "st-felix",
    userId: "felix",
    segments: [
      {
        id: "st-felix-1",
        media: storyImg("st-felix-a", "Now leasing in Yaba"),
        durationMs: IMAGE_STORY_MS,
        createdAt: minutesAgo(220),
      },
      {
        id: "st-felix-2",
        media: storyImg("st-felix-b", "Floor plan"),
        durationMs: IMAGE_STORY_MS,
        createdAt: minutesAgo(215),
      },
    ],
  },
  {
    id: "st-ima",
    userId: "ima",
    segments: [
      {
        id: "st-ima-1",
        media: storyImg("st-ima-a", "Move-in ready"),
        durationMs: IMAGE_STORY_MS,
        createdAt: minutesAgo(300),
      },
    ],
  },
];

/** Cursor-based pagination over the mock feed (cursor = last post id). */
export function getFeedPage(cursor: string | null, limit = 4): FeedPage {
  const start = cursor ? posts.findIndex((p) => p.id === cursor) + 1 : 0;
  const slice = posts.slice(start, start + limit);
  const last = slice.at(-1);
  const hasMore = last ? posts.indexOf(last) < posts.length - 1 : false;
  return { posts: slice, nextCursor: hasMore && last ? last.id : null };
}
