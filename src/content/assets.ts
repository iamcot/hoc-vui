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

/** Nhân vật cho lớp lớn: một bạn teen và Mochi phiên bản "ngầu" đi cùng */
export const TEEN =
  "a confident anime teen student about 14 years old, gender-neutral look, short dark hair, navy hoodie with subtle circuit patterns, headphones around the neck";
export const MOCHI_TEEN = "Mochi: a sleek white cat with glowing teal eyes and a light-blue scarf, cool and calm, perched on the student's shoulder";
export const XIXI_TEEN = "a futuristic scientific calculator with a glowing holographic display projecting light above it";

export const MOCHI =
  "Mochi: a small round white cat with big sparkly teal eyes, tiny pink nose, a light-blue scarf, wearing a small yellow backpack shaped like a calculator";

export const XIXI =
  "Xi Xi: a friendly anthropomorphic scientific calculator (dark navy body, light gray keys, small LCD screen showing a smile), tiny arms and legs";

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
const teen = (id: string, usage: string, prompt: string) => img(id, "1536x1024", usage, `${prompt}. Characters: ${TEEN}; ${MOCHI_TEEN}`, false, STYLE_TEEN);
const img = (id: string, size: ImageAsset["size"], usage: string, prompt: string, transparent = false, style = STYLE): ImageAsset => ({
  id,
  file: `/assets/img/${id}.webp`,
  size,
  usage,
  transparent,
  prompt: `${prompt}. ${style}${transparent ? ", isolated on a fully transparent background" : ""}.`,
});

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
  img("subject-fx580-cover", "1536x1024", "Ảnh lớn của môn Máy tính FX580 ở trang chủ (chữ đè lên phần dưới ảnh)", `${MOCHI} sitting next to ${XIXI} on a desk with notebooks and pencils, numbers floating like bubbles`),
  img("subject-soon", "1536x1024", "Thẻ môn sắp ra mắt", "A closed gift box with a ribbon on a cloud, small sparkles, mysterious and cute"),
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
  img("fx7-l01-cover", "1536x1024", "Lớp 7 · Bìa bài 1: Số hữu tỉ", `${MOCHI} standing on a number line that stretches left into cool blue ice (negative numbers) and right into warm sunshine, holding a glowing fraction-shaped ice cube`),
  img("fx7-l02-cover", "1536x1024", "Lớp 7 · Bìa bài 2: Lũy thừa số hữu tỉ", `${MOCHI} and ${XIXI} riding a small rocket that grows bigger in stages like a staircase, playful sense of rapid growth, pair of curved brackets shaped like a protective bubble around the rocket`),
  img("fx7-l03-cover", "1536x1024", "Lớp 7 · Bìa bài 3: Căn bậc hai", `${MOCHI} kneeling in a square vegetable garden, measuring one side with a ribbon tape, a sprouting plant with visible roots growing under the soil`),
  img("fx7-l04-cover", "1536x1024", "Lớp 7 · Bìa bài 4: Tỉ lệ thức", `${MOCHI} balancing a wooden seesaw scale with two equal groups of fruit on each side, ${XIXI} watching cheerfully`),
  img("fx7-l05-cover", "1536x1024", "Lớp 7 · Bìa bài 5: Đại lượng tỉ lệ", `${MOCHI} and three animal friends sharing a big layered cake cut into slices of different sizes, a stack of notebooks nearby`),
  img("fx7-l06-cover", "1536x1024", "Lớp 7 · Bìa bài 6: Thống kê", `${MOCHI} presenting a big colorful pie chart and a simple bar chart on a classroom easel, ${XIXI} pointing at the chart`),

  // Trình độ lớp 8, 9: phong cách teen, công nghệ (STYLE_TEEN)
  teen("fx8-l01-cover", "Lớp 8 · Bìa bài 1: Giá trị đa thức", `The student in a high-tech lab inserting a glowing value into a floating holographic machine, curved data streams flowing out the other side, ${XIXI_TEEN} on the desk`),
  teen("fx8-l02-cover", "Lớp 8 · Bìa bài 2: Hằng đẳng thức", "The student casting a glowing spell from fingertips, a large square splitting into four neon tiles (two squares, two rectangles) that rearrange in mid-air"),
  teen("fx8-l03-cover", "Lớp 8 · Bìa bài 3: Phương trình bậc nhất", "The student at night in front of a futuristic vault door with a glowing balance-scale lock, reaching out to turn a holographic dial, city lights behind"),
  teen("fx8-l04-cover", "Lớp 8 · Bìa bài 4: Định lí Pythagore", "The student standing on a rooftop at dusk next to a giant glowing right triangle made of light beams, three translucent square panels attached to its sides"),
  teen("fx8-l05-cover", "Lớp 8 · Bìa bài 5: Hàm số bậc nhất", "The student riding an electric scooter along a straight neon road rising across a dark grid like a graph line, distance markers glowing along the road"),
  teen("fx8-l06-cover", "Lớp 8 · Bìa bài 6: Xác suất", "The student flicking a glowing coin into the air while a translucent die spins mid-air, faint probability arcs and particles around, game-arcade lighting"),
  teen("fx9-l01-cover", "Lớp 9 · Bìa bài 1: Căn bậc hai, căn bậc ba", "The student examining a glowing translucent cube built from smaller cubes floating above an open palm, a digital tree with deep luminous roots in the background"),
  teen("fx9-l02-cover", "Lớp 9 · Bìa bài 2: Hệ phương trình", "The student as a sharp detective in a dark room studying a holographic map where two neon lines cross at one bright point"),
  teen("fx9-l03-cover", "Lớp 9 · Bìa bài 3: Phương trình bậc hai", "The student riding a sleek roller coaster whose track is a smooth glowing U-shaped parabola crossing a neon ground line at two points, night sky"),
  teen("fx9-l04-cover", "Lớp 9 · Bìa bài 4: Tỉ số lượng giác", "The student on a rooftop aiming a futuristic rangefinder at a tall tower, a glowing right triangle and angle arc projected between them"),
  teen("fx9-l05-cover", "Lớp 9 · Bìa bài 5: Đường tròn", "The student standing inside a huge glowing circular ring of light, holographic arcs and a sector highlighted in mint, sci-fi plaza at night"),
  teen("fx9-l06-cover", "Lớp 9 · Bìa bài 6: Hình trụ, nón, cầu", "The student in a design studio with three holographic wireframe solids floating above the desk: a cylinder, a cone and a sphere, soft neon lighting"),

  // Môn Tập đọc: ít tranh, chữ là chính
  img("subject-tapdoc-cover", "1536x1024", "Ảnh lớn của môn Tập đọc ở trang chủ (chữ đè lên phần dưới ảnh)", `${MOCHI.replace(", wearing a small yellow backpack shaped like a calculator", "")}, sitting on a stack of big picture books, holding an open book, a few large soft wooden alphabet blocks around (blank faces, no letters), warm reading nook`),
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
  { id: "bgm-learn", file: "/assets/sfx/bgm-learn.mp3", kind: "music", usage: "Nhạc nền nhẹ (tùy chọn, bật trong cài đặt)", prompt: "Calm lo-fi acoustic loop for children studying, soft piano and ukulele, 80 bpm, seamless loop, 60 seconds" },

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
