import available from "./available.json";
import { TAPDOC_VOICES } from "./subjects/tap-doc/voices";

/**
 * Danh mục ảnh và âm thanh. Mỗi mục có prompt để tạo bằng ChatGPT (ảnh) hoặc ElevenLabs (âm thanh).
 * Tạo xong, lưu đúng tên file vào public/assets/... là app tự dùng; chưa có file thì app hiện hình thay thế.
 * Chạy `npm run prompts` để in lại docs/ASSET_PROMPTS.md.
 */

export const STYLE =
  "Soft anime illustration in the style of a cozy Japanese children's picture book, clean dark-navy line art (#252845), soft cel shading, warm daylight. Color palette, bright but not neon: sky blue #4F72FF, coral peach #FF8A5C, mint green #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, on creamy whites #FFF3E3. Cute and calm, child-friendly but not babyish, no text, no letters, no watermark";

/**
 * Phong cách cho lớp lớn (8, 9 trở lên, và các môn cho tuổi teen): anime trưởng thành hơn, chất công nghệ.
 * Giữ cùng bảng màu để app vẫn liền mạch, nhưng nền tối hơn, ánh neon, giao diện hologram.
 */
export const STYLE_TEEN =
  "Modern anime illustration for teenagers aged 13 to 15, cinematic lighting, clean sharp line art, cel shading with subtle gradients, cool tech vibe with floating holographic UI panels and soft neon glow. Color palette: sky blue #4F72FF, mint #22B98C and lilac #9B7BFF neon accents over deep navy #1B1F3B and slate tones, a touch of coral #FF8A5C. Stylish and confident, not cute, not babyish, no text, no letters, no numbers, no watermark";

/**
 * Lớp 7 (khoảng 12 tuổi): bước chuyển giữa STYLE (lớp 6, dễ thương) và STYLE_TEEN (lớp 8).
 * Anime học đường tươi sáng, tỉ lệ người thật, không chibi; Mochi thành mèo cỡ thật đi cùng.
 */
export const STYLE_PRETEEN =
  "Bright modern slice-of-life school anime illustration for kids aged 12, natural body proportions (not chibi, no oversized heads), clean confident line art, soft cel shading, fresh daylight with gentle highlights. Color palette: sky blue #4F72FF, mint #22B98C, coral #FF8A5C, sunny yellow #FFB81F, lilac #9B7BFF over clean whites and light slate. Friendly and energetic, a little more grown-up than a picture book, not babyish, no text, no letters, no numbers, no watermark";
export const PRETEEN =
  "a cheerful anime student about 12 years old with natural proportions, short brown hair, white school shirt with a light-blue cardigan and a navy backpack";
export const MOCHI_PRE = "Mochi: a white cat with teal eyes and a light-blue scarf, normal cat proportions, calm and curious, sitting near the student";
export const XIXI_PRE = "a modern dark-navy scientific calculator with a softly lit screen (no face)";

/** Lớp 9 (khoảng 15 tuổi): như STYLE_TEEN nhưng điện ảnh, chín chắn hơn, ít lấp lánh */
export const STYLE_SENIOR = `${STYLE_TEEN.replace("aged 13 to 15", "aged 15")}. More mature and cinematic mood, refined composition, realistic proportions, restrained neon, fewer sparkles`;
export const TEEN9 =
  "a focused anime student about 15 years old, taller and more mature, short dark hair, navy jacket over a white shirt, wireless earbuds";

/** Nhân vật cho lớp lớn: một bạn teen và Mochi phiên bản "ngầu" đi cùng */
export const TEEN =
  "a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck";
export const MOCHI_TEEN = "Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder";
export const XIXI_TEEN = "a futuristic scientific calculator with a glowing holographic display projecting light above it";

export const MOCHI =
  "Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator";

export const XIXI =
  "Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs";

/**
 * Môn công nghệ cho bé lớn (Gõ phím): cùng tinh thần STYLE_TEEN nhưng bối cảnh biển sâu neon,
 * nhân vật là thỏ Bit (vẫn là con vật để còn chất Học Vui). Lớp 1-5 giữ STYLE (Mochi).
 */
/** ảnh bìa có chữ đè ở dưới: chừa 1/3 dưới tối, trống */
const TXT =
  ", one continuous scene from top to bottom: characters and main objects sit in the upper 60% of the frame, and the same scene simply continues into the bottom third (more of the grass, floor, table or ground in the same colors and lighting, a little softer and less detailed, gently shaded by a natural shadow), with no characters or busy details there so white title text can be laid over it; never a separate flat color band, panel or gradient bar";

export const STYLE_CYBER =
  "Modern Japanese anime illustration for teenagers, sleek sci-fi anime key visual, confident clean line art, crisp cel shading with glowing neon rim light, deep-sea cyber city mood. Palette: deep navy and indigo #050C2C #141D52, neon cyan #2FD3FF, hot pink #FF4FA3, violet #7C6BFF, accent amber #FFB020. Cool, stylish and techy, not babyish, no chibi, no text, no letters, no numbers, no watermark";

export const BIT =
  "Bit: a cool teenage anthropomorphic white-silver rabbit, slim and athletic, long upright ears whose tips glow with small LED lights (cyan on the left ear, pink on the right ear), a translucent cyan tech visor over the eyes, dark-navy tech jacket with thin cyan neon piping and a small keyboard-key badge on the chest, fingerless gloves, confident smile";

export interface ImageAsset {
  id: string;
  file: string;
  size: "1024x1024" | "1536x1024" | "1024x1536";
  usage: string;
  prompt: string;
  /** nền trong suốt */
  transparent?: boolean;
}

export interface AudioAsset {
  id: string;
  file: string;
  kind: "sfx" | "voice" | "music";
  usage: string;
  /** sfx/music: prompt cho ElevenLabs Sound Effects/Music. voice: lời thoại tiếng Việt */
  prompt: string;
}

/** ảnh phong cách lớp lớn */
const pre = (id: string, usage: string, prompt: string) => img(id, "1536x1024", usage, `${prompt}. Characters: ${PRETEEN}; ${MOCHI_PRE}`, false, STYLE_PRETEEN);
const senior = (id: string, usage: string, prompt: string) => img(id, "1536x1024", usage, `${prompt}. Characters: ${TEEN9}; ${MOCHI_TEEN}`, false, STYLE_SENIOR);
const teen = (id: string, usage: string, prompt: string) => img(id, "1536x1024", usage, `${prompt}. Characters: ${TEEN}; ${MOCHI_TEEN}`, false, STYLE_TEEN);
const img = (id: string, size: ImageAsset["size"], usage: string, prompt: string, transparent = false, style = STYLE): ImageAsset => ({
  id,
  file: `/assets/img/${id}.webp`,
  size,
  usage,
  transparent,
  prompt: `${prompt}. ${style}${transparent ? ", isolated on a fully transparent background" : ""}.`,
});

/** ảnh môn Gõ phím: phong cách công nghệ (STYLE_CYBER) thay cho STYLE của Mochi */
const cyber = (id: string, size: ImageAsset["size"], usage: string, prompt: string, transparent = false): ImageAsset => ({
  id,
  file: `/assets/img/${id}.webp`,
  size,
  usage,
  transparent,
  prompt: `${prompt}. ${STYLE_CYBER}${transparent ? ", isolated on a fully transparent background" : ""}.`,
});

/** icon nhỏ thay cho emoji mặc định (components/Ico.tsx): kiểu sticker game bóng bẩy, đọc rõ ở cỡ 20-28 px */
export const STYLE_ICON =
  "Game UI icon in a glossy soft-3D anime sticker style: one single object, centered, front view, chunky simple rounded shapes, bold clean dark-navy outline (#252845) plus a thin white outer rim, soft highlight on top, readable at 24 pixels, palette sky blue #4F72FF, coral #FF8A5C, mint #22B98C, sunny yellow #FFB81F, lilac #9B7BFF, no text, no letters, no numbers, no watermark, no shadow on the ground";
const icon = (id: string, usage: string, prompt: string): ImageAsset => ({
  id: `ic-${id}`,
  file: `/assets/img/ic-${id}.webp`,
  size: "1024x1024",
  usage: `Icon nhỏ: ${usage}`,
  transparent: true,
  prompt: `${prompt}. ${STYLE_ICON}, isolated on a fully transparent background.`,
});

/** thanh bên: một cây cọc gỗ dọc suốt từ trên xuống, các tấm biển gắn so le lên đó; chữ do app viết đè lên phần ván trống */
const WOOD = "warm light-honey wood with soft grain, cute storybook look, clean dark-brown outline";
const SIGN =
  `A single wooden arrow-shaped plank sign pointing to the RIGHT, seen straight from the front, nothing else: no post, no stake, no grass; the plank fills the whole image width, about 3.5 times wider than tall, ${WOOD}, two small nails near the left end (top and bottom) where it is nailed to a post; at the LEFT end a round painted emblem about 80% of the plank height; the whole area to the right of the emblem is a smooth, completely BLANK flat wood surface reserved for a label`;
const sign = (id: string, usage: string, emblem: string): ImageAsset =>
  img(`nav-${id}`, "1536x1024", `Tấm biển gắn vào cọc ở thanh bên: ${usage} (chữ do app viết đè lên ván trống)`, `${SIGN}. The emblem shows ${emblem}`, true);

const SEA_FISH = "side view, swimming toward the LEFT (head on the left), a large flat dark plate in the middle of the body left empty for a word label, glowing neon outline";

/** ô lưới môn Lập trình: nhìn thẳng từ trên xuống */
const TOP = "TOP-DOWN view seen from directly above, a single square game tile filling the whole image edge to edge";

export const IMAGES: ImageAsset[] = [
  // Nhân vật
  img("mochi-happy", "1024x1024", "Mochi vui vẻ: lời chào, slide mở đầu", `${MOCHI}, waving one paw and smiling, full body`, true),
  img("mochi-think", "1024x1024", "Mochi suy nghĩ: slide giải thích", `${MOCHI}, paw on chin, thinking, small question mark sparkle above head, full body`, true),
  img("mochi-wow", "1024x1024", "Mochi ngạc nhiên: mẹo hay, phím mới", `${MOCHI}, eyes wide with stars, both paws up in surprise, full body`, true),
  img("mochi-cheer", "1024x1024", "Mochi cổ vũ: trả lời đúng, hoàn thành bài", `${MOCHI}, jumping with joy, confetti around, full body`, true),
  img("mochi-oops", "1024x1024", "Mochi an ủi: trả lời sai", `${MOCHI}, sweat drop, sheepish encouraging smile, holding a tiny eraser, full body`, true),
  img("xixi", "1024x1024", "Xi Xi: thẻ môn FX580, trang giới thiệu", `${XIXI}, standing and giving a thumbs up, full body`, true),

  // Nền và màn hình chính
  img("bg-home", "1536x1024", "Cảnh nền màn hình Học (trang chủ), tràn toàn màn hình phía sau nội dung", "Wide landscape of a dreamy morning sky over gentle green hills and a cute small school building far away, soft clouds, floating paper planes, large calm empty sky area in the upper middle for text, low detail at the edges"),
  img("bg-map", "1536x1024", "Cảnh nền bản đồ bài học FX580, phía sau con đường bài học", "Wide storybook landscape seen slightly from above: meadows, a small river with a wooden bridge, scattered trees, a hill with a flag far away, very soft and low contrast so icons on top stay readable, no path drawn"),
  img("bg-lesson", "1536x1024", "Cảnh nền khi học bài, luyện tập, kiểm tra (rất nhạt để đọc chữ)", "Cozy study corner by a big window: wooden desk, a few books, a plant, warm afternoon light, background heavily blurred and very light, mostly empty bright space"),
  img("bg-arena", "1536x1024", "Cảnh nền trang Thi đấu và phòng thi", `${MOCHI} and two friend animals (a fox and a bunny) racing with calculators on a sunny sports field with colorful flags, characters on the left third, open bright sky on the right for text, dynamic but gentle`),
  img("bg-leaderboard", "1536x1024", "Cảnh nền trang Xếp hạng", "Festive outdoor stage at dusk with a podium of three steps, small trophies, bunting flags and twinkling stars, podium on the lower left, open sky for text"),
  // Theme Neon (bé chọn ở lần mở đầu hoặc trang Của tôi): nền tối thay cho nền Mochi ở trang chủ, bài học, thi đấu, xếp hạng
  cyber("bg-home-neon", "1536x1024", "Nền trang chủ theme Neon", "Wide background of a futuristic rooftop study garden at dusk above a glowing city, a calm teenage student sitting on a bench with a tablet, a sleek white cat with glowing teal eyes and a light-blue scarf beside them, holographic panels floating in the air, leave the left third and the bottom half calm and dark so text and cards can sit on top"),
  cyber("bg-lesson-neon", "1536x1024", "Nền bài học, kiểm tra theme Neon", "Wide background of a quiet high-tech study room at night, soft desk light, floating holographic notes shown as abstract shapes only, large window with city lights, very calm and low detail in the center where the lesson card sits"),
  cyber("bg-arena-neon", "1536x1024", "Nền thi đấu theme Neon", "Wide background of a futuristic e-sports arena for a quiz battle, two glowing podiums facing each other, a big holographic scoreboard shape with no text, spotlights and neon light beams, excited but not violent"),
  cyber("bg-leaderboard-neon", "1536x1024", "Nền bảng xếp hạng theme Neon", "Wide background of a night sky observatory deck with three floating glowing podium platforms in gold, silver and bronze tones rising into the stars, aurora in violet and cyan, a sleek white cat watching from the railing, keep the center dark and simple"),
  img("theme-pick-mochi", "1024x1024", "Ảnh xem trước khi chọn theme Mochi", `${MOCHI} waving in a sunny meadow with a little school in the distance, cozy and bright${TXT}`),
  cyber("theme-pick-neon", "1024x1024", "Ảnh xem trước khi chọn theme Neon", "A cool teenage student in a hoodie with headphones, a sleek white cat with glowing teal eyes on their shoulder, standing in front of floating holographic panels in a dark neon city"),
  img("subject-fx580-cover", "1536x1024", "Ảnh lớn của môn Máy tính FX580 ở trang chủ (chữ đè lên phần dưới ảnh)", `${MOCHI} sitting next to ${XIXI} on a desk with notebooks and pencils, numbers floating like bubbles${TXT}`),
  img("subject-soon", "1536x1024", "Thẻ môn sắp ra mắt", `A closed gift box with a ribbon on a cloud, small sparkles, mysterious and cute, the gift placed in the upper half and smaller${TXT}`),
  img("empty-login", "1024x1024", "Màn hình mời đăng nhập", `${MOCHI} holding a key and smiling at a small door`, true),

  // Huy hiệu trình độ
  img("level-mam", "1024x1024", "Huy hiệu trình độ Hạt mầm", "Round badge with a tiny sprout in soil, soft green and cream", true),
  img("level-choi", "1024x1024", "Huy hiệu trình độ Chồi non", "Round badge with a young plant with three leaves, soft green", true),
  img("level-cay", "1024x1024", "Huy hiệu trình độ Cây xanh", "Round badge with a small lush tree, soft green and sky blue", true),
  img("level-hoa", "1024x1024", "Huy hiệu trình độ Cây nở hoa", "Round badge with a tree in full pink blossom, sparkles", true),

  // Ảnh đại diện để con chọn
  ...["fox", "bunny", "panda", "owl", "bear", "penguin"].map((a) =>
    img(`avatar-${a}`, "1024x1024", `Ảnh đại diện: ${a}`, `Cute chibi ${a} face portrait in a circle, friendly expression, light pastel background circle`, true),
  ),

  // Bìa bài học
  img("fx-l01-cover", "1536x1024", "Bìa bài 1: Làm quen với Xi Xi", `${MOCHI} shaking hands with ${XIXI} on a sunny desk`),
  img("fx-l02-cover", "1536x1024", "Bìa bài 2: Thứ tự phép tính", "Cute operator symbols (+, −, ×, ÷ and parentheses) standing in a queue like children lining up, the parentheses at the front"),
  img("fx-l03-cover", "1536x1024", "Bìa bài 3: Lũy thừa", `${MOCHI} riding a small rocket that leaves a trail of doubling stars`),
  img("fx-l04-cover", "1536x1024", "Bìa bài 4: Chia có dư", "Colorful candies being shared into seven small bowls, two candies left over in the middle"),
  img("fx-l05-cover", "1536x1024", "Bìa bài 5: Số nguyên tố", `${MOCHI} as a detective with a magnifying glass looking at glowing prime number gems 2, 3, 5, 7`),
  img("fx-l06-cover", "1536x1024", "Bìa bài 6: ƯCLN, BCNN", "Gift boxes split into equal groups on one side and two blinking lighthouses on the other side"),
  img("fx-l07-cover", "1536x1024", "Bìa bài 7: Số nguyên âm", "A cute thermometer character standing in snowy mountains, a small submarine below the sea surface in the same scene"),
  img("fx-l08-cover", "1536x1024", "Bìa bài 8: Phân số", `${MOCHI} with a pizza cut into 8 slices, three slices taken`),
  img("fx-l09-cover", "1536x1024", "Bìa bài 9: Thập phân và phần trăm", "A cozy little stationery shop with discount tags showing a percent symbol"),
  img("fx-l10-cover", "1536x1024", "Bìa bài 10: Chu vi, diện tích", "A garden seen from above divided into rectangle, rhombus, parallelogram and trapezoid flower beds"),

  // Trình độ lớp 7 (bìa dùng luôn làm ảnh slide đầu)
  pre("fx7-l01-cover", "Lớp 7 · Bìa bài 1: Số hữu tỉ", `The student walking along a giant number line painted on a park path; to the left the path turns into cool blue ice (negative numbers), to the right warm sunlight; holding a glowing crystal shaped like a fraction bar`),
  pre("fx7-l02-cover", "Lớp 7 · Bìa bài 2: Lũy thừa số hữu tỉ", `The student launching a model rocket on the school field, its smoke trail climbing in bigger and bigger steps like a staircase, ${XIXI_PRE} clipped to the launch pad`),
  pre("fx7-l03-cover", "Lớp 7 · Bìa bài 3: Căn bậc hai", `The student measuring one side of a square garden plot on a school rooftop garden with a tape measure, a young plant with visible roots growing in a clear planter beside`),
  pre("fx7-l04-cover", "Lớp 7 · Bìa bài 4: Tỉ lệ thức", `The student in a bright science lab balancing a modern two-pan scale holding two equal groups of colorful blocks, a notebook open on the bench`),
  pre("fx7-l05-cover", "Lớp 7 · Bìa bài 5: Đại lượng tỉ lệ", `The student and two classmates at a café table sharing a big pizza cut into slices of different sizes, a notebook with a simple chart beside the plates`),
  pre("fx7-l06-cover", "Lớp 7 · Bìa bài 6: Thống kê", `The student presenting a colorful pie chart and bar chart on a large classroom screen, classmates seen from behind watching`),

  // Lớp 7: anime học đường (STYLE_PRETEEN) · lớp 8: teen công nghệ (STYLE_TEEN) · lớp 9: chín chắn, điện ảnh (STYLE_SENIOR)
  teen("fx8-l01-cover", "Lớp 8 · Bìa bài 1: Giá trị đa thức", `The student in a high-tech lab inserting a glowing value into a floating holographic machine, curved data streams flowing out the other side, ${XIXI_TEEN} on the desk`),
  teen("fx8-l02-cover", "Lớp 8 · Bìa bài 2: Hằng đẳng thức", "The student casting a glowing spell from fingertips, a large square splitting into four neon tiles (two squares, two rectangles) that rearrange in mid-air"),
  teen("fx8-l03-cover", "Lớp 8 · Bìa bài 3: Phương trình bậc nhất", "The student at night in front of a futuristic vault door with a glowing balance-scale lock, reaching out to turn a holographic dial, city lights behind"),
  teen("fx8-l04-cover", "Lớp 8 · Bìa bài 4: Định lí Pythagore", "The student standing on a rooftop at dusk next to a giant glowing right triangle made of light beams, three translucent square panels attached to its sides"),
  teen("fx8-l05-cover", "Lớp 8 · Bìa bài 5: Hàm số bậc nhất", "The student riding an electric scooter along a straight neon road rising across a dark grid like a graph line, distance markers glowing along the road"),
  teen("fx8-l06-cover", "Lớp 8 · Bìa bài 6: Xác suất", "The student flicking a glowing coin into the air while a translucent die spins mid-air, faint probability arcs and particles around, game-arcade lighting"),
  senior("fx9-l01-cover", "Lớp 9 · Bìa bài 1: Căn bậc hai, căn bậc ba", "The student examining a glowing translucent cube built from smaller cubes floating above an open palm, a digital tree with deep luminous roots in the background"),
  senior("fx9-l02-cover", "Lớp 9 · Bìa bài 2: Hệ phương trình", "The student as a sharp detective in a dark room studying a holographic map where two neon lines cross at one bright point"),
  senior("fx9-l03-cover", "Lớp 9 · Bìa bài 3: Phương trình bậc hai", "The student riding a sleek roller coaster whose track is a smooth glowing U-shaped parabola crossing a neon ground line at two points, night sky"),
  senior("fx9-l04-cover", "Lớp 9 · Bìa bài 4: Tỉ số lượng giác", "The student on a rooftop aiming a futuristic rangefinder at a tall tower, a glowing right triangle and angle arc projected between them"),
  senior("fx9-l05-cover", "Lớp 9 · Bìa bài 5: Đường tròn", "The student standing inside a huge glowing circular ring of light, holographic arcs and a sector highlighted in mint, sci-fi plaza at night"),
  senior("fx9-l06-cover", "Lớp 9 · Bìa bài 6: Hình trụ, nón, cầu", "The student in a design studio with three holographic wireframe solids floating above the desk: a cylinder, a cone and a sphere, soft neon lighting"),

  // Môn Tập đọc: ít tranh, chữ là chính
  img("subject-tapdoc-cover", "1536x1024", "Ảnh lớn của môn Tập đọc ở trang chủ (chữ đè lên phần dưới ảnh)", `${MOCHI.replace(", wearing a small yellow backpack shaped like a calculator", "")}, sitting on a stack of big picture books, holding an open book, a few large soft wooden alphabet blocks around (blank faces, no letters), warm reading nook${TXT}`),
  img("td-cover", "1536x1024", "Ảnh chung cho thẻ \"Học tiếp\" của môn Tập đọc (chữ to đè lên)", "A cozy empty classroom blackboard corner with soft chalk dust, a small potted plant and a stack of books, large plain empty area in the middle, very soft and light"),
  img("mochi-read", "1024x1024", "Mochi đọc sách: màn hình bé ghi âm đọc to", `${MOCHI.replace(", wearing a small yellow backpack shaped like a calculator", "")}, holding an open book and reading aloud with a small music-note sparkle near its mouth, one ear perked up as if listening, full body`, true),

  // Minh họa trong bài
  img("fx-l01-s1", "1536x1024", "Bài 1, slide 1: Mochi giới thiệu Xi Xi", `${MOCHI} presenting ${XIXI} with open paws, sparkles`),
  img("fx-l01-s3", "1536x1024", "Bài 1, slide 3: chữ vàng chữ đỏ trên phím", "Close-up of three calculator keys, each with a small yellow label and a small red label above it, glowing softly, two tiny arrows pointing to the labels"),
  img("fx-l02-s1", "1536x1024", "Bài 2, slide 1: luật xếp hàng phép tính", "Four podium steps labelled with icons: parentheses on top, then a power symbol, then × ÷, then + −, cute characters on each step"),
  img("fx-l02-s4", "1536x1024", "Bài 2, slide 4: mẹ đi chợ", "A mother cat and Mochi at a Vietnamese wet market stall with oranges and bundles of vegetables"),
  img("fx-l03-s1", "1536x1024", "Bài 3, slide 1: lũy thừa nhân đôi", "A row of five boxes, each containing twice as many glowing marbles as the one before"),
  img("fx-l04-s1", "1536x1024", "Bài 4, slide 1: chia kẹo", `${MOCHI} handing out candies to seven classmates sitting in a circle, two candies left`),
  img("fx-l05-s1", "1536x1024", "Bài 5, slide 1: số nguyên tố là viên đá quý", "Glowing gemstones with numbers 2, 3, 5, 7, 11 inside, and ordinary pebbles with 4, 6, 9 beside them"),
  img("fx-l06-s1", "1536x1024", "Bài 6, slide 1: GCD và LCM", "Two cute twin robot characters with badges, one badge shows a gift box, the other shows a clock"),
  img("fx-l06-s4", "1536x1024", "Bài 6, slide 4: chia giỏ trái cây", "Twelve equal baskets each with oranges and tangerines, arranged neatly on a table"),
  img("fx-l07-s1", "1536x1024", "Bài 7, slide 1: số âm quanh ta", "Split scene: snowy mountain town with a thermometer below zero on the left, a submarine underwater with a depth gauge on the right"),
  img("fx-l08-s1", "1536x1024", "Bài 8, slide 1: bánh pizza 3/8", "A round pizza cut into 8 equal slices, 3 slices slightly pulled out, top view"),
  img("fx-l09-s2", "1536x1024", "Bài 9, slide 2: làm tròn số", "A number line like a little road with a ball rolling to the nearest flag, gentle hills"),
  img("fx-l09-s4", "1536x1024", "Bài 9, slide 4: mua giày giảm giá", `${MOCHI} trying on sneakers in a shop, a big sale tag nearby`),
  img("fx-l10-s1", "1536x1024", "Bài 10, slide 1: các hình", "Five friendly shape characters: rectangle, square, rhombus, parallelogram, isosceles trapezoid, standing together"),
  img("fx-l10-s3", "1536x1024", "Bài 10, slide 3: rào sân", "A rectangular schoolyard with a small wooden fence being built around it, top-down three-quarter view"),

  // ── Môn Gõ phím (tông công nghệ, nhân vật thỏ Bit) ──
  cyber("bit-happy", "1024x1024", "Thỏ Bit chào: slide mở đầu môn Gõ phím (tạo ảnh này TRƯỚC, các ảnh Bit khác lấy làm mẫu)", `${BIT}, standing relaxed and giving a small two-finger salute, full body`, true),
  cyber("bit-think", "1024x1024", "Bit suy nghĩ: slide giải thích", `${BIT}, one hand touching the visor which shows a tiny holographic keyboard, thinking, full body`, true),
  cyber("bit-wow", "1024x1024", "Bit ngạc nhiên: phím mới, mẹo hay", `${BIT}, visor glowing pink, ears straight up in surprise, both hands open, full body`, true),
  cyber("bit-cheer", "1024x1024", "Bit ăn mừng: hoàn thành, thắng cuộc", `${BIT}, jumping with a fist pump, neon sparks around, full body`, true),
  cyber("bit-oops", "1024x1024", "Bit an ủi: thua lượt, gõ sai nhiều", `${BIT}, scratching the back of the head with a lopsided grin, visor showing a small glitch, full body`, true),
  cyber("gp-bit-diver", "1024x1024", "Thợ lặn trong game cá mập (bên trái màn hình, nhìn sang phải)", `${BIT} in a sleek dark-navy diving suit with cyan neon lines, round glass helmet around the head with the ears inside, small oxygen tank on the back, holding a laser blaster shaped like a compact keyboard pointing to the RIGHT, floating underwater, side three-quarter view facing right`, true),
  cyber("gp-fish", "1024x1024", "Cá nhỏ trong game (mang 1-3 chữ cái)", `A small sleek robotic piranha-like fish with amber glowing fins, ${SEA_FISH}`, true),
  cyber("gp-jelly", "1024x1024", "Sứa trong game (mang 1-3 chữ cái)", "A cyber jellyfish with a violet translucent dome and glowing pink circuit tentacles, front view, the dome has a darker flat center area for a short word label", true),
  img(
    "gp-hands",
    "1536x1024",
    "Hai bàn tay nét mảnh đặt trên bàn phím ảo (chế độ Ngón tay ảo). App tự canh đầu ngón út trùng phím A và ;",
    "Two human hands seen from directly above in the classic touch-typing home-row position, as in a typing-tutor diagram: the eight fingertips rest in one straight horizontal row across the image at about 30% from the top, evenly spaced, left pinky fingertip at about 12% from the left edge and right pinky fingertip at about 88%; fingers gently curved and relaxed, natural proportions (middle finger longest, pinky shortest); both thumbs rest a little lower near the center pointing slightly toward each other; wrists and forearms continue straight down to the bottom edge; left and right hands mirror each other",
    true,
    "Elegant minimal line drawing: one smooth continuous thin white outline (about 3 px), no fill, no shading, no color, no fingernails detail, no keyboard, no background objects, clean vector look like a premium app icon guide, no text, no letters, no watermark",
  ),
  cyber("gp-shark", "1536x1024", "Cá mập máy (mang một từ)", `A cool mechanical shark with dark navy armor plates, cyan glowing gill lines and a red glowing eye, sharp but not gory, ${SEA_FISH}`, true),
  cyber("gp-boss", "1536x1024", "Cá mập trùm (mang từ dài, câu)", `A huge boss mechanical shark with magenta neon armor, glowing pink eyes, spiky dorsal fin like a radio antenna, menacing but kid-friendly, ${SEA_FISH}`, true),
  cyber("bg-gp-deep", "1536x1024", "Cảnh nền game cá mập: biển sâu (để trống giữa cho cá bơi qua)", "Wide underwater scene in the deep ocean at night: soft god rays from the surface at the top, a far-away glowing cyber city of coral towers on the seabed at the bottom, floating particles, the middle band left mostly empty and dark-blue so fish sprites and labels stay readable, low contrast at the center"),
  cyber("bg-gp-map", "1536x1024", "Cảnh nền bản đồ bài của môn Gõ phím", "Top-down view of a deep-sea cyber city: glowing neon coral reefs, light trails on the seabed like circuit boards, small submarine docks, very dark and low contrast so map nodes on top stay readable"),
  cyber("bg-gp-lesson", "1536x1024", "Cảnh nền bài học, kiểm tra của môn Gõ phím (rất tối, mờ)", "Inside a cozy high-tech submarine control room with a big round window showing the dark ocean, keyboard consoles with soft cyan glow, background heavily blurred and dark, mostly empty"),
  cyber("subject-gophim-cover", "1536x1024", "Ảnh lớn môn Gõ phím ở trang chủ (chữ đè lên phần dưới ảnh)", `${BIT} as a diver aiming a keyboard laser blaster at a mechanical shark charging in from the right, letters glowing on the shark's side, deep ocean with neon light rays, dynamic action pose, upper half has the action, lower third darker for text`),
  cyber("bg-gp-race", "1536x1024", "Cảnh nền đường đua (chế độ Đua xe)", "A neon hover-car race track inside a glass tunnel under the sea, track lanes glowing cyan and pink seen from the side, fish swimming outside the tunnel, the track runs horizontally across the image, dark background"),
  cyber("gp-car", "1536x1024", "Xe đua trong chế độ Đua xe (app tự đổi màu cho từng bạn)", "A sleek futuristic hover race car, side view facing RIGHT, white and silver body with glowing cyan underlights and a small bubble cockpit, no driver visible, no numbers", true),
  cyber("gp-mode-survival", "1024x1024", "Biểu tượng chế độ Sinh tồn", "Round app-icon style badge: a mechanical shark head with glowing red eye bursting through a ring of three neon hearts", true),
  cyber("gp-mode-passage", "1024x1024", "Biểu tượng chế độ Bài gõ hay", "Round app-icon style badge: a glowing holographic scroll of paper floating above a neon keyboard", true),
  cyber("gp-mode-race", "1024x1024", "Biểu tượng chế độ Đua xe", "Round app-icon style badge: a neon hover race car crossing a checkered finish line", true),
  cyber("gp-tier-1", "1024x1024", "Huy hiệu trình độ Hàng phím cơ sở", "Hexagon tech badge with two glowing keycaps side by side, each with a small raised bump, cyan glow", true),
  cyber("gp-tier-2", "1024x1024", "Huy hiệu trình độ Từng bàn tay", "Hexagon tech badge with a robotic glove hand outline made of neon lines, violet glow", true),
  cyber("gp-tier-3", "1024x1024", "Huy hiệu trình độ Phối hợp", "Hexagon tech badge with two neon hands crossing over a keyboard, pink and cyan glow", true),
  cyber("gp-tier-4", "1024x1024", "Huy hiệu trình độ Telex (gõ tiếng Việt)", "Hexagon tech badge with a glowing keycap that has a small hook and hat accent marks floating above it like Vietnamese diacritics, amber glow, no real letters", true),
  cyber("gp-cover-nha", "1536x1024", "Bìa các bài Hàng phím cơ sở (thẻ Học tiếp)", `${BIT} resting both hands on the middle row of a giant glowing keyboard that lies on the seabed like a dance floor`),
  cyber("gp-cover-tay", "1536x1024", "Bìa các bài Từng bàn tay", `${BIT} reaching up to a glowing top-row key and down to a bottom-row key of a giant neon keyboard, underwater`),
  cyber("gp-cover-phoi", "1536x1024", "Bìa các bài Phối hợp", `${BIT} typing fast with both hands on a holographic keyboard, light trails following the fingers, a school of neon fish swirling around`),
  cyber("gp-cover-telex", "1536x1024", "Bìa các bài Telex", `${BIT} in a submarine cockpit typing, glowing Vietnamese-style accent marks (hooks, hats, tone marks) floating like bubbles, no full words`),

  // Thanh bên: cây cọc dọc + các tấm biển
  img("nav-pole", "1024x1536", "Thân cọc gỗ dọc thanh bên (app lặp ảnh theo chiều dọc, kéo dài suốt màn hình)", `A straight vertical wooden post segment, seen from the front, centered, filling the full image height and about 12% of the width, ${WOOD}; SEAMLESS vertically: the top and bottom edges must tile perfectly when repeated (no cap, no end, no knots cut at the edges), nothing else in the image`, true),
  img("nav-title", "1536x1024", "Biển tên app treo trên đầu cọc (app đặt logo và chữ Học Vui lên trên)", `A single wide rounded-rectangle wooden name plaque, front view, about 3.2 times wider than tall, filling the image width, ${WOOD}, a slightly thicker carved frame border, two small nails in the middle of the top and bottom edges, a tiny green leaf vine curling on one corner, the inner area completely BLANK flat wood for a logo and title, no post, nothing else`, true),
  sign("hoc", "Học", "an open storybook with a small sprout"),
  sign("thi-dau", "Thi đấu", "a yellow lightning bolt over two crossed pencils"),
  sign("xep-hang", "Xếp hạng", "a small golden trophy cup"),

  // Icon nhỏ thay emoji
  icon("star", "XP (sao)", "A plump five-pointed golden star with a soft shine"),
  icon("fire", "Chuỗi ngày học (lửa)", "A cute round flame, orange outside and yellow inside"),
  icon("trophy", "Cúp, bảng xếp hạng, kỷ lục", "A shiny golden trophy cup with two handles on a small base"),
  icon("medal-1", "Hạng nhất", "A round gold medal with a blue ribbon, a star engraved in the middle"),
  icon("medal-2", "Hạng nhì", "A round silver medal with a blue ribbon, a star engraved in the middle"),
  icon("medal-3", "Hạng ba", "A round bronze medal with a blue ribbon, a star engraved in the middle"),
  icon("bolt", "Thi đấu, thử thách, bonus", "A chunky yellow lightning bolt"),
  icon("retry", "Chơi lại, làm lại", "Two curved mint-green arrows chasing each other in a circle"),
  icon("invite", "Mời bạn", "A sky-blue envelope with a pink heart seal and a small paper-plane wing"),
  icon("party", "Chúc mừng, đúng rồi", "A party popper cone bursting with colorful confetti"),
  icon("sound", "Nghe, loa", "A rounded blue speaker with two sound waves"),
  icon("hint", "Gợi ý, mẹo", "A glowing yellow light bulb with a tiny sparkle"),
  icon("mic", "Đọc to, ghi âm", "A round retro microphone, coral and silver"),
  icon("target", "Bấm theo, không sai phím", "A round red and white target with a small arrow in the bullseye"),
  icon("rocket", "Thử thách lên lớp", "A small white and coral rocket flying up with a little flame"),
  icon("flag", "Về đích, tạo phòng", "A black and white checkered finish flag waving on a short pole"),
  icon("calc", "Máy tính", "A small dark-navy scientific calculator with a teal screen and round buttons"),
  icon("pencil", "Luyện tập, thử nhanh", "A yellow pencil with a pink eraser, tilted"),
  icon("ticket", "Vào phòng bằng mã", "A lilac admission ticket with a perforated edge and a star"),
  icon("scroll", "Bài gõ hay", "A rolled paper scroll partly open, cream paper with a red ribbon"),
  icon("lock", "Chưa mở khóa", "A chunky golden padlock, closed"),
  icon("heart", "Mạng sống trong game", "A plump glossy red heart"),
  icon("shark", "Vào game cá mập", "A cute small blue shark head with a friendly grin"),
  icon("warn", "Chú ý", "A rounded yellow warning triangle with an exclamation shape made of a bar and a dot (not a letter)"),

  // ── Môn Lập trình khối lệnh (Vỡ lòng: Mochi trên lưới, STYLE) ──
  img("subject-laptrinh-cover", "1536x1024", "Ảnh lớn môn Lập trình ở trang chủ (chữ đè lên phần dưới ảnh)", `${MOCHI.replace(", wearing a small yellow backpack shaped like a calculator", "")}, walking on a giant board game grid of grass tiles toward a red flag, big colorful puzzle-piece shaped command blocks (blue, purple, yellow, blank faces with no text) floating in the air like a path behind it, a few golden stars on the tiles${TXT}`),
  img("lt-cover-vo-long", "1536x1024", "Bìa các bài Vỡ lòng môn Lập trình", `${MOCHI}, standing on a grass tile of a big garden grid board, holding a blue puzzle-piece command block (blank, no text), small stone walls and a red flag on other tiles, golden stars here and there`),
  img("lt-cover-co-ban", "1536x1024", "Bìa các bài Cơ bản môn Lập trình (lặp, nếu, bút vẽ)", `${MOCHI}, holding a giant crayon and drawing a neat square spiral path on a big garden grid board, a green looping arrow ribbon circling above, small stone walls on some tiles`),
  img("lt-tier-1", "1024x1024", "Huy hiệu trình độ Vỡ lòng (môn Lập trình)", "Round badge: a small white cat paw print stepping on a green grid tile with a tiny arrow, mint and sky-blue colors", true),
  img("lt-tier-2", "1024x1024", "Huy hiệu trình độ Cơ bản (môn Lập trình)", "Round badge: a looping circular arrow made of a mint-green puzzle-piece block around a yellow star", true),
  img("lt-tier-3", "1024x1024", "Huy hiệu trình độ Trung cấp (môn Lập trình)", "Round badge: a cute game controller made of colorful puzzle-piece blocks, lilac glow", true),
  img("lt-tier-4", "1024x1024", "Huy hiệu trình độ Nâng cao (môn Lập trình)", "Round badge: a row of bar-chart columns being sorted from short to tall with a small curved arrow, sky blue and coral", true),
  img("lt-tier-5", "1024x1024", "Huy hiệu trình độ Python (môn Lập trình)", "Round badge: a friendly round blue and yellow snake coiled around a pair of curly code brackets made of simple shapes (no letters)", true),
  img("lt-mochi-top", "1024x1024", "Mochi nhìn từ trên xuống trên lưới (app tự xoay theo hướng đi, ảnh phải nhìn LÊN TRÊN)", `${MOCHI}, seen from directly above (bird's-eye top-down view), walking and facing UP toward the top of the image, round body, ears and scarf visible from above, centered`, true),
  img("lt-tile-grass", "1024x1024", "Ô cỏ của lưới (lặp nhiều lần, nên đơn giản)", `${TOP}: soft short green grass with a few tiny lighter blades, very simple and even so it tiles well, no objects`),
  img("lt-tile-wall", "1024x1024", "Ô tường đá của lưới", `${TOP}: a chunky rounded grey stone block with soft moss on one corner, filling most of the tile`, true),
  img("lt-tile-water", "1024x1024", "Ô nước của lưới", `${TOP}: clear blue pond water with small soft ripples and a lily pad, filling the tile edge to edge`),
  img("lt-tile-star", "1024x1024", "Ngôi sao cần nhặt trên lưới", "A plump shiny golden five-pointed star, slightly tilted, soft sparkle, centered, small soft shadow", true),
  img("lt-tile-flag", "1024x1024", "Cờ đích trên lưới", "A small red pennant flag on a short wooden pole planted in a tiny mound of grass, seen from a high three-quarter angle, centered", true),
];

const sfx = (id: string, usage: string, prompt: string): AudioAsset => ({ id, file: `/assets/sfx/${id}.mp3`, kind: "sfx", usage, prompt });
const voice = (id: string, usage: string, prompt: string): AudioAsset => ({ id, file: `/assets/voice/${id}.mp3`, kind: "voice", usage, prompt });

export const VOICE_SETTINGS =
  "ElevenLabs Text to Speech, model Multilingual v2 hoặc v3, giọng nữ trẻ ấm áp (vd. chọn giọng tiếng Việt trong Voice Library), stability ~50%, style thấp, tốc độ chậm vừa. Xuất MP3 44.1kHz.";

export const AUDIO: AudioAsset[] = [
  sfx("tap", "Chạm phím máy tính ảo, nút bấm", "Soft short plastic button click, gentle, 0.1 seconds"),
  sfx("correct", "Trả lời đúng", "Cheerful bright two-note chime, soft xylophone, 0.6 seconds"),
  sfx("wrong", "Trả lời sai", "Gentle low wooden 'bonk', friendly, not harsh, 0.4 seconds"),
  sfx("complete", "Hoàn thành bài học / luyện tập", "Short magical sparkle fanfare with soft bells, 2 seconds"),
  sfx("levelup", "Kết quả kiểm tra trình độ, lên cấp", "Uplifting harp glissando followed by a soft chime, 2.5 seconds"),
  sfx("tick", "Đếm ngược 3 giây cuối khi thi đấu", "Soft clock tick, single, 0.2 seconds"),
  sfx("whoosh", "Chuyển slide", "Very soft paper whoosh, 0.3 seconds"),
  // nhạc nền: lặp liền mạch, không lời, nhỏ nhẹ để không át giọng đọc
  { id: "bgm-learn", file: "/assets/sfx/bgm-learn.mp3", kind: "music", usage: "Nhạc nền khi học bài, làm bài (môn Máy tính, Tập đọc)", prompt: "Calm lo-fi acoustic loop for children studying, soft piano and ukulele, 80 bpm, seamless loop, 60 seconds" },
  { id: "bgm-home", file: "/assets/sfx/bgm-home.mp3", kind: "music", usage: "Nhạc nền trang chủ, bản đồ bài, xếp hạng", prompt: "Bright, bouncy and playful loop for a kids learning app home screen, upbeat ukulele strumming, hand claps, glockenspiel melody, light shaker and kick, sunny happy energy that invites kids to start playing, 118 bpm, major key, no vocals, seamless loop, 60 seconds" },
  { id: "bgm-gp", file: "/assets/sfx/bgm-gp.mp3", kind: "music", usage: "Nhạc nền môn Gõ phím: bản đồ, bài học, bài gõ hay (cyber, tập trung)", prompt: "Chill synthwave lo-fi loop for focused typing practice, soft analog synth pads, mellow arpeggio, light muted beat, deep-sea cyber city mood, 85 bpm, no vocals, unobtrusive, seamless loop, 75 seconds" },
  { id: "bgm-gp-game", file: "/assets/sfx/bgm-gp-game.mp3", kind: "music", usage: "Nhạc nền game cá mập và chế độ sinh tồn", prompt: "Upbeat underwater electronic action loop for a kids typing game, bubbly synth bass, plucky arpeggios, light driving drums, sonar pings, exciting but not stressful, 120 bpm, no vocals, seamless loop, 75 seconds" },
  { id: "bgm-arena", file: "/assets/sfx/bgm-arena.mp3", kind: "music", usage: "Nhạc nền phòng thi đấu (đua xe gõ phím, thi máy tính)", prompt: "Energetic competition loop for kids, bright synth lead, punchy but soft drums, racing countdown energy, positive and fun, 128 bpm, no vocals, seamless loop, 60 seconds" },

  voice("vo-l01-s1", "Bài 1, slide 1", "Chào em, tớ là Mochi! Đây là bạn đồng hành mới của chúng mình, máy tính Casio fx năm tám mươi V N X. Tớ gọi bạn ấy là Xi Xi. Cùng làm quen nhé!"),
  voice("vo-l01-s2", "Bài 1, slide 2", "Bấm ON để bật máy. Phím AC xóa hết để làm phép tính mới, còn phím DEL chỉ xóa một chữ số thôi."),
  voice("vo-l01-s3", "Bài 1, slide 3", "Em có thấy chữ nhỏ màu vàng và màu đỏ trên phím không? Bấm SHIFT để dùng chữ vàng, bấm ALPHA để dùng chữ đỏ."),
  voice("vo-l01-s4", "Bài 1, slide 4", "Nếu máy hiện kết quả lạ, em có thể đưa máy về cài đặt gốc. Nhưng nhớ là bộ nhớ sẽ bị xóa đó."),
  voice("vo-l01-s5", "Bài 1, slide 5", "Giờ thử phép tính đầu tiên nhé. Em chạm vào các phím theo đúng thứ tự, rồi bấm bằng."),
  voice("vo-l02-s1", "Bài 2, slide 1", "Các phép tính cũng phải xếp hàng đấy. Trong ngoặc trước, rồi lũy thừa, rồi nhân chia, cuối cùng mới đến cộng trừ."),
  voice("vo-l02-s4", "Bài 2, slide 4", "Đi chợ cùng mẹ nào! Em chỉ cần viết thành một biểu thức, rồi gõ liền một lần vào máy."),
  voice("vo-l03-s1", "Bài 3, slide 1", "Lũy thừa là nhân một số với chính nó nhiều lần. Hai mũ năm là hai nhân hai nhân hai nhân hai nhân hai, bằng ba mươi hai."),
  voice("vo-l04-s1", "Bài 4, slide 1", "Một trăm cái kẹo chia cho bảy bạn. Mỗi bạn được mười bốn cái, còn dư hai cái. Xi Xi tính việc này chỉ trong một lần bấm."),
  voice("vo-l05-s1", "Bài 5, slide 1", "Số nguyên tố giống như viên đá quý, chỉ chia hết cho một và chính nó. Hôm nay mình làm thám tử đi tìm chúng nhé."),
  voice("vo-l06-s1", "Bài 6, slide 1", "Gặp hai người bạn mới: GCD là ước chung lớn nhất, LCM là bội chung nhỏ nhất. Họ sống trên phím nhân và phím chia."),
  voice("vo-l06-s4", "Bài 6, slide 4", "Chia đều, nhiều nhất thì nghĩ đến ước chung lớn nhất. Lặp lại, gặp nhau lần tới thì nghĩ đến bội chung nhỏ nhất."),
  voice("vo-l07-s1", "Bài 7, slide 1", "Ở Sa Pa có khi lạnh dưới không độ. Những con số nhỏ hơn không gọi là số âm. Xi Xi có phím riêng cho dấu âm đó."),
  voice("vo-l08-s1", "Bài 8, slide 1", "Chiếc bánh cắt thành tám miếng, em ăn ba miếng, vậy em đã ăn ba phần tám cái bánh."),
  voice("vo-l09-s1", "Bài 9, slide 1", "Mình viết ba phẩy năm, nhưng trên máy em bấm dấu chấm nhé. Hai cách viết là một số thôi."),
  voice("vo-l09-s4", "Bài 9, slide 4", "Đôi giày đang giảm giá hai mươi phần trăm. Cùng tính xem còn phải trả bao nhiêu tiền nào."),
  voice("vo-l10-s1", "Bài 10, slide 1", "Đây là bảng công thức chu vi và diện tích. Em không cần học thuộc ngay, cứ xem lại mỗi khi cần nhé."),
  voice("vo-l10-s3", "Bài 10, slide 3", "Rào xung quanh là chu vi, còn lát nền là diện tích. Đọc kỹ đề trước khi bấm máy nhé."),
  // Lớp 7, 8, 9: mỗi bài một câu chào ngắn ở slide đầu (các slide khác không tự đọc)
  voice("vo7-l01", "Lớp 7 · Bài 1, câu chào", "Chào mừng em lên lớp 7! Hôm nay mình làm quen với số hữu tỉ nhé."),
  voice("vo7-l02", "Lớp 7 · Bài 2, câu chào", "Cẩn thận cái bẫy dấu ngoặc nha, lũy thừa số âm dễ nhầm lắm đó!"),
  voice("vo7-l03", "Lớp 7 · Bài 3, câu chào", "Hôm nay Xi Xi chỉ em phím căn bậc hai và cách làm tròn số."),
  voice("vo7-l04", "Lớp 7 · Bài 4, câu chào", "Hai tỉ số bằng nhau gọi là tỉ lệ thức. Nhân chéo là ra ngay!"),
  voice("vo7-l05", "Lớp 7 · Bài 5, câu chào", "Cùng tăng hay ngược chiều? Mình tìm hiểu đại lượng tỉ lệ nào."),
  voice("vo7-l06", "Lớp 7 · Bài 6, câu chào", "Điểm trung bình của em là bao nhiêu? Bấm máy tính thử xem!"),
  voice("vo8-l01", "Lớp 8 · Bài 1, câu chào", "Chào mừng em lên lớp 8! Hôm nay mình thay số vào đa thức nhé."),
  voice("vo8-l02", "Lớp 8 · Bài 2, câu chào", "Bảy hằng đẳng thức giống bảy câu thần chú tính nhanh đó!"),
  voice("vo8-l03", "Lớp 8 · Bài 3, câu chào", "Cùng đi tìm x nào. Chuyển vế xong, Xi Xi tính hộ cho!"),
  voice("vo8-l04", "Lớp 8 · Bài 4, câu chào", "Tam giác vuông có một bí mật tên là định lí Pythagore."),
  voice("vo8-l05", "Lớp 8 · Bài 5, câu chào", "Hàm số giống một cỗ máy: bỏ x vào, ra y."),
  voice("vo8-l06", "Lớp 8 · Bài 6, câu chào", "Gieo xúc xắc, tung đồng xu. Hôm nay mình học xác suất!"),
  voice("vo9-l01", "Lớp 9 · Bài 1, câu chào", "Chào mừng em lên lớp 9! Mình gặp căn bậc ba nhé."),
  voice("vo9-l02", "Lớp 9 · Bài 2, câu chào", "Hai manh mối, hai ẩn số. Cùng giải hệ phương trình nào!"),
  voice("vo9-l03", "Lớp 9 · Bài 3, câu chào", "Delta quyết định phương trình bậc hai có mấy nghiệm đó."),
  voice("vo9-l04", "Lớp 9 · Bài 4, câu chào", "Sin, cos, tan nghe khó nhưng Xi Xi bấm một cái là ra."),
  voice("vo9-l05", "Lớp 9 · Bài 5, câu chào", "Số pi thần kỳ đang trốn trên phím của Xi Xi đó!"),
  voice("vo9-l06", "Lớp 9 · Bài 6, câu chào", "Lon nước, que kem, quả bóng: mình tính thể tích các khối tròn nhé."),
  voice("vo-correct-3", "Khen khi đúng (ngẫu nhiên)", "Đúng rồi, em bấm máy giỏi ghê!"),
  voice("vo-correct-1", "Khen khi đúng (ngẫu nhiên)", "Chính xác! Giỏi quá!"),
  voice("vo-correct-2", "Khen khi đúng (ngẫu nhiên)", "Tuyệt vời, đúng rồi!"),
  voice("vo-wrong-1", "Động viên khi sai", "Chưa đúng rồi, thử xem lại cách bấm nhé."),
  voice("vo-complete", "Hoàn thành bài", "Hoàn thành bài học rồi! Mochi tự hào về em lắm."),
  // ── Môn Gõ phím: hiệu ứng ngắn, gọn tai; giọng đọc chỉ ở bài đầu mỗi trình độ ──
  sfx("gp-key", "Gõ đúng một phím", "Very soft short mechanical keyboard key click, clean, 0.08 seconds"),
  sfx("gp-miss", "Gõ sai phím", "Short soft digital error blip, low pitch, not harsh, 0.15 seconds"),
  sfx("gp-hit", "Bắn hạ cá", "Short sci-fi laser zap followed by a small underwater bubble pop, 0.5 seconds"),
  sfx("gp-bite", "Cá chạm vào thợ lặn", "Muffled underwater chomp with a short low warning buzz, 0.5 seconds"),
  sfx("gp-wave", "Bắt đầu lượt, đợt cá mới", "Deep sonar ping with soft echo underwater, 1 second"),
  sfx("gp-go", "Đếm ngược xuất phát đua xe", "Three short electronic countdown beeps and a higher go beep, 2 seconds"),
  voice("vo-gp-n01", "Gõ phím · Bài đầu Hàng phím cơ sở, câu chào của Bit", "Chào em, tớ là Bit! Mình sẽ lặn xuống biển sâu và hạ cá mập bằng bàn phím. Trước tiên, đặt hai ngón trỏ lên phím F và J nhé."),
  voice("vo-gp-t01", "Gõ phím · Bài đầu Từng bàn tay", "Lên hàng trên nào! Ngón nào với lên phím nào thì gõ xong phải về hàng phím cơ sở nha."),
  voice("vo-gp-p01", "Gõ phím · Bài đầu Phối hợp", "Giờ hai tay cùng chơi. Gõ đều tay, mắt nhìn màn hình là sẽ nhanh thôi."),
  voice("vo-gp-v01", "Gõ phím · Bài đầu Telex", "Gõ tiếng Việt có dấu thôi! Gõ a hai lần là thành chữ â. Học Vui tự ghép chữ cho em."),
  voice("vo-lt-a01", "Lập trình · Bài đầu Vỡ lòng, câu chào của Mochi", "Chào em! Hôm nay em làm người ra lệnh, còn tớ làm theo. Xếp các khối lệnh thật đúng để dẫn tớ về lá cờ nhé!"),
];

/** Giọng đọc mẫu môn Tập đọc (in riêng ở docs/TAPDOC_VOICES.md) */
export const TAPDOC_AUDIO: AudioAsset[] = TAPDOC_VOICES.map((v) => ({ id: v.id, file: `/assets/voice/${v.id}.mp3`, kind: "voice", usage: v.group, prompt: v.text }));

export const imageById = (id: string) => IMAGES.find((i) => i.id === id);
export const audioById = (id: string) => AUDIO.find((a) => a.id === id) ?? TAPDOC_AUDIO.find((a) => a.id === id);

const AVAILABLE = new Map<string, string>(
  (available as string[]).map((f) => [f.replace(/\.(webp|png|jpe?g|mp3|m4a|wav|ogg)$/i, ""), f]),
);
/** Đường dẫn file thật đã có trong public/assets (chấp nhận .webp/.png/.jpg, .mp3/.m4a/.wav), hoặc undefined. */
export const resolveFile = (file: string) => AVAILABLE.get(file.replace(/\.[a-z0-9]+$/i, ""));
export const hasFile = (file: string) => resolveFile(file) !== undefined;
